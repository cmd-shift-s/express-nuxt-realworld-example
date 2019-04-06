import request from 'supertest'
import faker from 'faker'
import { app } from '~/server/app'
import { Connection, createConnection } from 'typeorm'
import { User } from '~/server/entity'
import { ArticleFormData } from '~/models'
import { getAuthentication, generateJoinedUser, JoinedUser } from '../utils'

describe('API - articles', () => {
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

    user = await generateJoinedUser(conn)
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

  test('get articles - returns Articles and articleCount', async () => {
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

  test('post articles - throws NotFound', async () => {
    // When
    return req.get(`/api/articles/${faker.lorem.slug()}/comments`)

    // Then
    .expect(404)
  })

  test('get articles/_slug/comments - returns Comments', async () => {
    // Given
    const articleForm: ArticleFormData = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      tagList: faker.lorem.words().split(' ')
    }

    const token = await getAuthentication(req, user)

    let res = await req.post(`/api/articles`)
      .set('Authorization', `Token ${token}`)
      .send({ article: articleForm })
      .expect(200)
    const slug = res.body.article.slug

    // When
    res = await req.get(`/api/articles/${slug}/comments`)
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('comments')
    expect(res.body.comments).toBeInstanceOf(Array)
  })

  test('get articles/_slug - returns Article', async () => {
    // Given
    const articleForm: ArticleFormData = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      tagList: faker.lorem.words().split(' ')
    }

    const token = await getAuthentication(req, user)

    let res = await req.post(`/api/articles`)
      .set('Authorization', `Token ${token}`)
      .send({ article: articleForm })
      .expect(200)
    const slug = res.body.article.slug

    // When
    res = await req.get(`/api/articles/${slug}`)
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('article')
    expect(res.body.article).toHaveProperty('slug')
    expect(res.body.article.slug).toBe(slug)
    expect(res.body.article.title).toEqual(articleForm.title)
    expect(res.body.article.description).toEqual(articleForm.description)
    expect(res.body.article.body).toEqual(articleForm.body)
    expect(res.body.article.tagList).toEqual(articleForm.tagList)
    expect(res.body.article).toHaveProperty('author')
    expect(res.body.article.author).not.toHaveProperty('password')
    expect(res.body.article.author.email).toEqual(user.email)
    expect(res.body.article.author.username).toEqual(user.username)
  })

  test('post articles - throws Unauthorized', () => {
    // Given
    const article = {}

    // When
    return req.post(`/api/articles`)
      .send({ article })

    // Then
    .expect(401)
  })

  test('post articles - throws NotFound', async () => {
    // Given
    const token = await getAuthentication(req, user)

    // When
    return req.post(`/api/articles`)
      .set('Authorization', `Token ${token}`)

    // Then
    .expect(400)
  })

  test('post articles - returns Article', async () => {
    // Given
    const articleForm: ArticleFormData = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      tagList: faker.lorem.words().split(' ')
    }

    const token = await getAuthentication(req, user)

    // When
    const res = await req.post(`/api/articles`)
      .set('Authorization', `Token ${token}`)
      .send({ article: articleForm })
      .expect(200)

    expect(res.body).toHaveProperty('article')
    expect(res.body.article.slug).not.toBeNull()
    expect(res.body.article.title).toEqual(articleForm.title)
    expect(res.body.article.description).toEqual(articleForm.description)
    expect(res.body.article.body).toEqual(articleForm.body)
    expect(res.body.article.tagList).toEqual(articleForm.tagList)
    expect(res.body.article).toHaveProperty('author')
    expect(res.body.article.author).not.toHaveProperty('password')
    expect(res.body.article.author.email).toEqual(user.email)
    expect(res.body.article.author.username).toEqual(user.username)
  })

  test('delete articles/_slug - returns Article', async () => {
    // Given
    const articleForm: ArticleFormData = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      tagList: faker.lorem.words().split(' ')
    }

    const token = await getAuthentication(req, user)

    let res = await req.post(`/api/articles`)
      .set('Authorization', `Token ${token}`)
      .send({ article: articleForm })
      .expect(200)

    const slug = res.body.article.slug

    // When
    res = await req.delete(`/api/articles/${slug}`)
      .set('Authorization', `Token ${token}`)
      .expect(200)

    expect(res.body).toHaveProperty('article')
    expect(res.body.article.slug).toEqual(slug)
    expect(res.body.article.title).toEqual(articleForm.title)
    expect(res.body.article.description).toEqual(articleForm.description)
    expect(res.body.article.body).toEqual(articleForm.body)
    expect(res.body.article.tagList).toEqual(articleForm.tagList)
    expect(res.body.article).toHaveProperty('author')
    expect(res.body.article.author).not.toHaveProperty('password')
    expect(res.body.article.author.email).toEqual(user.email)
    expect(res.body.article.author.username).toEqual(user.username)
  })

  test('post articles/_slug/favorite - returns Article', async () => {
    // Given
    const articleForm: ArticleFormData = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      tagList: faker.lorem.words().split(' ')
    }

    const token = await getAuthentication(req, user)

    let res = await req.post(`/api/articles`)
      .set('Authorization', `Token ${token}`)
      .send({ article: articleForm })
      .expect(200)

    const slug = res.body.article.slug

    // When
    res = await req.post(`/api/articles/${slug}/favorite`)
      .set('Authorization', `Token ${token}`)
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('article')
    expect(res.body.article.favorited).toBeTruthy()
    expect(res.body.article.favoritesCount).toBeGreaterThanOrEqual(1)
    expect(res.body.article.slug).toEqual(slug)
    expect(res.body.article.title).toEqual(articleForm.title)
    expect(res.body.article.description).toEqual(articleForm.description)
    expect(res.body.article.body).toEqual(articleForm.body)
    expect(res.body.article.tagList).toEqual(articleForm.tagList)
    expect(res.body.article).toHaveProperty('author')
    expect(res.body.article.author).not.toHaveProperty('password')
    expect(res.body.article.author.email).toEqual(user.email)
    expect(res.body.article.author.username).toEqual(user.username)
  })

  test('delete articles/_slug/favorite - returns Article', async () => {
    // Given
    const articleForm: ArticleFormData = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      tagList: faker.lorem.words().split(' ')
    }

    const token = await getAuthentication(req, user)

    let res = await req.post(`/api/articles`)
      .set('Authorization', `Token ${token}`)
      .send({ article: articleForm })
      .expect(200)

    const slug = res.body.article.slug

    await req.post(`/api/articles/${slug}/favorite`)
      .set('Authorization', `Token ${token}`)
      .expect(200)

    // When
    res = await req.delete(`/api/articles/${slug}/favorite`)
      .set('Authorization', `Token ${token}`)
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('article')
    expect(res.body.article.favorited).toBeFalsy()
    expect(res.body.article.favoritesCount).toEqual(0)
    expect(res.body.article.slug).toEqual(slug)
    expect(res.body.article.title).toEqual(articleForm.title)
    expect(res.body.article.description).toEqual(articleForm.description)
    expect(res.body.article.body).toEqual(articleForm.body)
    expect(res.body.article.tagList).toEqual(articleForm.tagList)
    expect(res.body.article).toHaveProperty('author')
    expect(res.body.article.author).not.toHaveProperty('password')
    expect(res.body.article.author.email).toEqual(user.email)
    expect(res.body.article.author.username).toEqual(user.username)
  })
})
