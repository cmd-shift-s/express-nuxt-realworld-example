import faker from 'faker'
import request from 'supertest'
import { Connection, createConnection } from 'typeorm'
import { app } from '~/server/app'
import { Article, Comment, User, CommentForm } from '~/server/entity'
import * as fixture from '../unit/fixtures'
import { generateJoinedUser, getAuthentication, JoinedUser, persists } from '../utils'

describe('API - comments', () => {
  const req = request(app)
  let conn: Connection
  let user: User
  let token: String

  let mockComment: Comment
  let mockArticle: Article

  function api(slug: string, id?: number) {
    return `/api/articles/${slug}/comments` + ((typeof id !== 'undefined') ? `/${id}` : '')
  }

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

    user = await generateJoinedUser() as User
    token = await getAuthentication(req, user)

    mockArticle = await persists(Article, fixture.generateArticle({ author: user }))
    mockComment = await persists(Comment, fixture.generateComment({ author: user, article: mockArticle }))
  })

  afterEach(async () => {
    if (conn && conn.isConnected) {
      if (mockComment) {
        await conn.getRepository(Comment).remove(mockComment)
      }
      if (mockArticle) {
        await conn.getRepository(Article).remove(mockArticle)
      }
      if (user) {
        await conn.getRepository(User).remove(user)
      }
    }
  })

  afterAll(() => {
    if (conn && conn.isConnected) {
      return conn.close()
    }
  })

  /**
   * Get Comment[]
   */

  test('get comments - throws NotFound(Article)', async () => {
    // When
    return req.get(api(faker.lorem.slug()))

    // Then
    .expect(404)
  })

  test('get comments - returns Comment[]', async () => {
    // When
    const res = await req.get(api(mockArticle.slug))
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('comments')
    expect(res.body.comments).toBeInstanceOf(Array)

    const comment = res.body.comments.find((v: Comment) => v.id === mockComment.id)
    expectComment(comment)
  })

  /**
   * Post Comment
   */

  test('post comments - throws BadRequest', async () => {
    // When
    return req.post(api(faker.lorem.slug()))

    // Then
    .expect(400)
  })

  test('post comments - throws Unauthorized', async () => {
    // When
    return req.post(api(faker.lorem.slug()))
      .send({ comment: mockComment })

    // Then
    .expect(401)
  })

  test('post comments - throws NotFound(Article)', async () => {
    // When
    return req.post(api(faker.lorem.slug()))
      .set('Authorization', `Token ${token}`)
      .send({ comment: mockComment })

    // Then
    .expect(404)
  })

  test('post comments - returns Comment', async () => {
    // Given
    const commentForm = fixture.generateComment({ author: user })

    // When
    const res = await req.post(api(mockArticle.slug))
      .set('Authorization', `Token ${token}`)
      .send({ comment: commentForm })
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('comment')
    commentForm.id = res.body.comment.id
    expectComment(res.body.comment, commentForm)
  })

  /**
   * Put Comment
   */

  test('put comments - throws BadRequest', async () => {
    // When
    return req.put(api(faker.lorem.slug(), 0))

    // Then
    .expect(400)
  })

  test('put comments - throws Unauthorized', async () => {
    // Given
    const commentForm = fixture.generateComment()

    // When
    await req.put(api(faker.lorem.slug(), 0))
      .send({ comment: commentForm })

    // Then
    .expect(401)

    expectComment(await getComment(mockComment.id))
  })

  test('put comments - throws NotFound', async () => {
    // Given
    const commentForm = fixture.generateComment()

    // When
    await req.put(api(faker.lorem.slug(), 0))
      .set('Authorization', `Token ${token}`)
      .send({ comment: commentForm })

    // Then
    .expect(404)

    expectComment(await getComment(mockComment.id))
  })

  test('put comments - throws Forbidden', async () => {
    // Given
    const mockUser = await generateJoinedUser()
    const token = await getAuthentication(req, mockUser)
    const commentForm = fixture.generateComment()

    // When
    await req.put(api(faker.lorem.slug(), mockComment.id))
      .set('Authorization', `Token ${token}`)
      .send({ comment: commentForm })

      // Then
      .expect(403)

    expectComment(await getComment(mockComment.id))
    await conn.getRepository(User).remove(mockUser as User)
  })

  test('put comments - returns Comment', async () => {
    // Given
    const commentForm: CommentForm = {
      body: faker.lorem.sentence()
    }

    // When
    const res = await req.put(api(faker.lorem.slug(), mockComment.id))
      .set('Authorization', `Token ${token}`)
      .send({ comment: commentForm })
      .expect(200)

    // Then
    expect(res.body).toHaveProperty('comment')
    expectComment(res.body.comment, Object.assign(mockComment, commentForm))
  })

  /**
   * Delete Comment
   */

  test('delete comments - throws NotFound', async () => {
    // When
    await req.delete(api(faker.lorem.slug()))

    // Then
    .expect(404)

    expectComment(await getComment(mockComment.id))
  })

  test('delete comments/:id - throws Unauthorized', async () => {
    // When
    await req.delete(api(faker.lorem.slug(), 0))

    // Then
    .expect(401)

    expectComment(await getComment(mockComment.id))
  })

  test('delete comments/:id - throws NotFound', async () => {
    // When
    await req.delete(api(faker.lorem.slug(), 0))
              .set('Authorization', `Token ${token}`)

    // Then
    .expect(404)

    expectComment(await getComment(mockComment.id))
  })

  test('delete comments/:id - throws Forbidden', async () => {
    // Given
    const mockUser = await generateJoinedUser()
    const token = await getAuthentication(req, mockUser)

    // When
    await req.delete(api(mockArticle.slug, mockComment.id))
      .set('Authorization', `Token ${token}`)

      // Then
      .expect(403)

    expectComment(await getComment(mockComment.id))

    await conn.getRepository(User).remove(mockUser as User)
  })

  test('delete comments/:id - returns OK', async () => {
    // When
    await req.delete(api(mockArticle.slug, mockComment.id))
                    .set('Authorization', `Token ${token}`)

    // Then
    .expect(200)

    await expect(getComment(mockComment.id))
      .rejects.toThrowError('Could not find any entity of type "Comment"')
  })

  function getComment(id: number) {
    return conn.getRepository(Comment).findOneOrFail(id, { relations: ['author'] })
  }

  function expectComment(actual: Comment, expected: Comment = mockComment) {
    expect(actual).not.toBeFalsy()
    expect(actual.id).toEqual(expected.id)
    expect(actual.body).toEqual(expected.body)
    expect(actual).toHaveProperty('author')
    expect(actual.author.username).toEqual(expected.author.username)
    expect(actual.author.bio).toEqual(expected.author.bio)
    expect(actual.author.image).toEqual(expected.author.image)
  }

})
