import request from 'supertest'
import { app } from '~/server/app'

describe('API - profile', () => {
  const req = request(app)

  test('should return profile', async () => {
    // Given
    const username = 'Eric Simons'

    // When
    const res = await req.get('/api/profile/' + username)
      .query({ username })
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('profile')
    expect(res.body.profile).toHaveProperty('username')
    expect(res.body.profile.username).toBe(username)
  })
})
