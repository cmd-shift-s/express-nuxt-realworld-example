import request from 'supertest'
import { app } from '~/server/app'

describe('API - articles', () => {
  const req = request(app)

  test('should return articles and articleCount', async () => {
    // When
    const res = await req.get('/api/articles')
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('articles')
    expect(res.body).toHaveProperty('articleCount')
    expect(res.body.articles).toBeInstanceOf(Array)
    expect(res.body.articleCount).not.toBeNaN()
  })
})
