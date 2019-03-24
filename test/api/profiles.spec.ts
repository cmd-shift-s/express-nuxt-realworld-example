import request from 'supertest'
import faker from 'faker'
import { createConnection, Connection } from 'typeorm'
import { app } from '~/server/app'
import { User } from '~/server/entity'

describe('API - profiles', () => {
  const req = request(app)
  let conn: Connection
  let user: Pick<User, 'email' | 'username' | 'password'>

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

    user = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    }

    await req.post('/api/users')
      .send({ user })
      .expect(200)
  })

  afterEach(() => {
    return conn.createQueryBuilder()
      .delete()
      .from(User)
      .where({ email: user.email })
      .execute()
  })

  afterAll(async () => {
    if (conn && conn.isConnected) {
      await conn.close()
    }
  })

  async function getAuthentication(_user = user): Promise<string> {
    const res = await req.post('/api/users/login')
      .send({ user: _user })
      .expect(200)

    expect(res.body).toHaveProperty('user')
    expect(res.body.user.token).not.toBeNull()

    return res.body.user.token
  }

  test('should throws NotFound', () => {
    // Given
    const username = 'not_found_user'

    // When
    return req.get('/api/profiles/' + username)
      .expect(404)
  })

  test('should returns Profile', async () => {
    // When
    const res = await req.get('/api/profiles/' + user.username)
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('profile')
    expect(res.body.profile).not.toBeNull()
    expect(res.body.profile.username).toBe(user.username)
    expect(res.body.profile.following).toBeFalsy()
  })

  test('should returns Profile with following', async () => {
    // Given
    const follower = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    }

    await req.post('/api/users')
      .send({ user: follower })
      .expect(200)

    const followerToken = await getAuthentication(follower)

    await req.post('/api/profiles/' + user.username + '/follow')
      .set('Authorization', `Token ${followerToken}`)
      .expect(200)

    // When
    const res = await req.get('/api/profiles/' + user.username)
      .set('Authorization', `Token ${followerToken}`)
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('profile')
    expect(res.body.profile).not.toBeNull()
    expect(res.body.profile.username).toBe(user.username)
    expect(res.body.profile.following).toBeTruthy()
  })

  test('should returns Profile(follow & unfollow)', async () => {
    // Given
    let follower = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    }

    await req.post('/api/users')
      .send({ user: follower })
      .expect(200)

    const followerToken = await getAuthentication(follower)

    // When
    let res = await req.post('/api/profiles/' + user.username + '/follow')
      .set('Authorization', `Token ${followerToken}`)
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('profile')
    expect(res.body.profile).not.toBeNull()
    expect(res.body.profile.username).toBe(user.username)
    expect(res.body.profile.following).toBeTruthy()

    // When
    res = await req.delete('/api/profiles/' + user.username + '/follow')
      .set('Authorization', `Token ${followerToken}`)
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('profile')
    expect(res.body.profile).not.toBeNull()
    expect(res.body.profile.username).toBe(user.username)
    expect(res.body.profile.following).toBeFalsy()

  })

  test('should throws Unauthorized #follow', () => {
    // When
    return req.post('/api/profiles/' + user.username + '/follow')
      .expect(401)
  })

  test('should throws NotFound #follow', async () => {
    // Given
    const token = await getAuthentication()
    const username = 'not_found_user'

    // When
    return req.post('/api/profiles/' + username + '/follow')
      .set('Authorization', `Token ${token}`)
      .expect(404)
  })

  test('should throws Unauthorized #unfollow', () => {
    // When
    return req.delete('/api/profiles/' + user.username + '/follow')
      .expect(401)
  })

  test('should throws NotFound #unfollow', async () => {
    // Given
    const token = await getAuthentication()
    const username = 'not_found_user'

    // When
    return req.delete('/api/profiles/' + username + '/follow')
      .set('Authorization', `Token ${token}`)
      .expect(404)
  })

})
