import request from 'supertest'
import { NotFoundError } from 'routing-controllers'
import { app } from '~/server/app'

describe('API', () => {
  const req = request(app)

  test('not found exception', () => {
    return req.get('/api/not_found')
      .expect(404, { errors: { body: [NotFoundError.name] } })
  })
})
