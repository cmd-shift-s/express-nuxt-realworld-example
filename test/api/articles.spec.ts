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

  test('should return articles and articleCount with limit', async () => {
    // Given
    const limit = 1

    // When
    const res = await req.get(`/api/articles?limit=${limit}`)
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('articles')
    expect(res.body).toHaveProperty('articleCount')
    expect(res.body.articles).toBeInstanceOf(Array)
    expect(res.body.articles).toHaveLength(limit)
    expect(res.body.articleCount).toBe(limit)
  })

  test('should return comments with slug', async () => {
    // Given
    const slug = 'article-slug'

    // When
    const res = await req.get(`/api/articles/${slug}/comments`)
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('comments')
    expect(res.body.comments).toBeInstanceOf(Array)
  })

})
