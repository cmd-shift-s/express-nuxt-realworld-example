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
})
