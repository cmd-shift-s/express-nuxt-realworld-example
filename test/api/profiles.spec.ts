import request from 'supertest'
import { createConnection, Connection } from 'typeorm'
import { app } from '~/server/app'
import { User } from '~/server/entity'
import { getAuthentication, generateJoinedUser, JoinedUser } from '../utils'

describe('API - profiles', () => {
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

    user = await generateJoinedUser()
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
    const follower = await generateJoinedUser()

    const followerToken = await getAuthentication(req, follower)

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
    const follower = await generateJoinedUser()

    const followerToken = await getAuthentication(req, follower)

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
    const token = await getAuthentication(req, user)
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
    const token = await getAuthentication(req, user)
    const username = 'not_found_user'

    // When
    return req.delete('/api/profiles/' + username + '/follow')
      .set('Authorization', `Token ${token}`)
      .expect(404)
  })

})
