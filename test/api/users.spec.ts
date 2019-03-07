import request from 'supertest'
import { app } from '~/server/app'

describe('API - users', () => {
  const req = request(app)

  test('should return user', async () => {
    // Given
    const user = {
      email: 'login@test.com',
      password: 'Secret!'
    }

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

  test('should return UnprocessableEntityError', async () => {
    // Given
    const user = {
      email: 'login@test.com',
      password: 'invalid password'
    }

    // When
    const res = await req.post('/api/users/login')
      .send({ user })
      .expect(422)

    // Then
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toHaveProperty('body')
    expect(res.body.errors.body).toEqual(['email or password is invalid'])
  })

  test('should return user \\w authorization', async () => {
    // Given
    const user = {
      email: 'login@test.com',
      password: 'Secret!'
    }

    // When
    let res = await req.post('/api/users/login')
      .send({ user })
      .expect(200)

    expect(res.body).toHaveProperty('user')
    expect(res.body.user.token).not.toBeNull()

    res = await req.get('/api/user')
      .set('Authorization', `Bearer ${res.body.user.token}`)
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('user')
    expect(res.body.user).toHaveProperty('email')
    expect(res.body.user.email).toBe(user.email)
    expect(res.body.user.token).not.toBeNull()
  })

  test('should throw AuthorizedRequiredError', async () => {
    const res = await req.get('/api/user')
      .expect(401)

    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors).toHaveProperty('body')
    expect(res.body.errors.body).toBeInstanceOf(Array)
    expect(res.body.errors.body)
      .toContain('Authorization is required for request on GET /api/user')
  })
})
