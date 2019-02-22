import request from 'supertest'
import { app } from '~/server/app'

describe('API - tags', () => {
  const req = request(app)

  test('should return tags', async () => {
    // When
    const res = await req.get('/api/tags')
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('tags')
    expect(res.body.tags).toBeInstanceOf(Array)
  })
})
