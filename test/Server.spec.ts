import request from 'supertest'
import { NotFoundError } from 'routing-controllers'
import { app } from '~/server/app'

describe('Server', () => {
  const req = request(app)

  test('not found exception', () => {
    return req.get('/api/not_found')
      .expect(404, JSON.stringify(new NotFoundError()))
  })

  test('should return tags', async () => {
    // Then
    const res = await req.get('/api/tags')
      .expect(200)

    expect(res.body).toHaveProperty('tags')
    expect(res.body.tags).toBeInstanceOf(Array)
  })
})
