import request from 'supertest'
import faker from 'faker'
import { createConnection, Connection } from 'typeorm'
import { app } from '~/server/app'
import { User } from '~/server/entity'
import { UserUpdateInfo } from '~/server/services'
import { getAuthentication, generateJoinedUser, JoinedUser } from '../utils'

describe('API - users', () => {
  const req = request(app)
  let conn: Connection
  let user: JoinedUser

  beforeAll(async () => {
    conn = await createConnection()
    if (!conn || !conn.isConnected) {
      fail('cannot connect database')
    }
  })

  beforeEach(async () => {
    if (!conn || !conn.isConnected) {
      fail('cannot connect database')
    }

    user = await generateJoinedUser(conn)
  })

  afterEach(() => {
    if (user && conn && conn.isConnected) {
      return conn.getRepository(User).remove(user as User)
    }
  })

  afterAll(() => {
    if (conn && conn.isConnected) {
      return conn.close()
    }
  })

  test('post /api/users - returns User', async () => {
    // Given
    const registInfo = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password()
    }

    // When
    const res = await req.post('/api/users')
      .send({ user: registInfo })
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('user')
    expect(res.body.user).toHaveProperty('email')
    expect(res.body.user.email).toBe(registInfo.email)
    expect(res.body.user.token).not.toBeNull()
  })

  test('post /api/users - throws UnprocessableEntityError #1', async () => {
    // Given
    const registInfo = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    // When
    const res = await req.post('/api/users')
      .send({ user: registInfo })
      .expect(422)

    // Then
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toHaveProperty('body')
    expect(res.body.errors.body).toEqual(['Name is required'])
  })

  test('post /api/users - throws UnprocessableEntityError #2', async () => {
      // Given
    const registInfo = {
      username: faker.internet.userName(),
      password: faker.internet.password()
    }

      // When
    const res = await req.post('/api/users')
        .send({ user: registInfo })
        .expect(422)

      // Then
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toHaveProperty('body')
    expect(res.body.errors.body).toEqual(['Email is required'])
  })

  test('post /api/users/login - returns User', async () => {
    // When
    const res = await req.post('/api/users/login')
      .send({ user })
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('user')
    expect(res.body.user).toHaveProperty('email')
    expect(res.body.user.email).toBe(user.email)
    expect(res.body.user.token).not.toBeNull()
  })

  test('post /api/users/login - throws UnprocessableEntityError #1', async () => {
    // Given
    const loginInfo = {
      email: faker.internet.email(),
      password: user.password
    }

    // When
    const res = await req.post('/api/users/login')
      .send({ user: loginInfo })
      .expect(422)

    // Then
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toHaveProperty('body')
    expect(res.body.errors.body).toEqual(['email or password is invalid'])
  })

  test('post /api/users/login - throws UnprocessableEntityError #2', async () => {
    // Given
    const loginInfo = {
      email: user.email,
      password: faker.internet.password()
    }

    // When
    const res = await req.post('/api/users/login')
      .send({ user: loginInfo })
      .expect(422)

    // Then
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toHaveProperty('body')
    expect(res.body.errors.body).toEqual(['email or password is invalid'])
  })

  test('get /api/user - returns User w/ token', async () => {
    // When
    const token = await getAuthentication(req, user)

    const res = await req.get('/api/user')
      .set('Authorization', `Token ${token}`)
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('user')
    expect(res.body.user).toHaveProperty('email')
    expect(res.body.user.email).toBe(user.email)
    expect(res.body.user.token).not.toBeNull()
  })

  test('get /api/user - throws Unauthorized', async () => {
    // When
    const res = await req.get('/api/user')
      .expect(401)

    // Then
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toHaveProperty('body')
    expect(res.body.errors.body).toBeInstanceOf(Array)
    expect(res.body.errors.body)
      .toContain('Authorization is required for request on GET /api/user')
  })

  test('put /api/user - throws Unauthorized', async () => {
    // When
    const res = await req.put('/api/user')
      .expect(401)

    // Then
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toHaveProperty('body')
    expect(res.body.errors.body).toBeInstanceOf(Array)
    expect(res.body.errors.body)
      .toContain('Authorization is required for request on PUT /api/user')
  })

  test('put /api/user - return User', async () => {
    // Given
    const token = await getAuthentication(req, user)

    const updateUser: UserUpdateInfo = {
      username: `${user.username}!`,
      email: `${user.email}!`,
    }

    // When
    const res = await req.put('/api/user')
      .send({ user: updateUser })
      .set('Authorization', `Token ${token}`)
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('user')
    expect(res.body.user).not.toBeNull()
    expect(res.body.user.username).toEqual(updateUser.username)
    expect(res.body.user.email).toEqual(updateUser.email)
    expect(res.body.user.token).not.toBeNull()
    expect(res.body.user.token).not.toEqual(token)

  })
})
