import { Connection, createConnection, Repository } from 'typeorm'
import { Article, Comment, User, CommentForm } from '~/server/entity'
import { CommentService } from '~/server/services'
import { generateJoinedUser, JoinedUser, persists } from '~/test/utils'
import faker from 'faker'
import * as fixture from '../fixtures'

describe('CommentService', () => {
  let conn: Connection
  let repository: Repository<Comment>
  let service: CommentService
  let user: JoinedUser

  let mockComment: Comment
  let mockArticle: Article
  let mockAuthor: User

  beforeAll(async () => {
    conn = await createConnection()
    if (!conn || !conn.isConnected) {
      fail('cannot connect database')
    }

    repository = conn.getRepository(Comment)
    service = new CommentService(repository)
  })

  beforeEach(async () => {
    if (!conn || !conn.isConnected) {
      fail('cannot connect database')
    }

    user = await generateJoinedUser()
    mockAuthor = await persists(User, fixture.generateUser())
    mockArticle = await persists(Article, fixture.generateArticle({ author: mockAuthor }))
    mockComment = await persists(Comment, fixture.generateComment({ author: mockAuthor, article: mockArticle }))
  })

  afterEach(async () => {
    if (conn && conn.isConnected) {
      if (mockComment) {
        await repository.remove(mockComment)
      }
      if (mockArticle) {
        await conn.getRepository(Article).remove(mockArticle)
      }
      if (mockAuthor) {
        await conn.getRepository(User).remove(mockAuthor)
      }
      await conn.getRepository(User).remove(user as User)
    }
  })

  afterAll(() => {
    if (conn && conn.isConnected) {
      return conn.close()
    }
  })

  test('#save - returns Comment', async () => {
    // Given
    const mockComment = fixture.generateComment({ article: mockArticle, author: mockAuthor })

    // When
    const actual = await service.create(mockComment, mockArticle, mockAuthor)

    // Then
    mockComment.id = actual.id
    expectComment(actual, mockComment)

    const savedComment = await repository.findOne(actual.id, { relations: ['article', 'author'] })
    expectComment(savedComment!, mockComment)
  })

  test('#findByArticle - returns Comment[]', async () => {
    // When
    const comments = await service.findByArticle(mockArticle)

    // Then
    expect(comments.length).toBeGreaterThanOrEqual(1)

    const comment = comments.find(v => v.id === mockComment.id)
    expect(comment).not.toBeUndefined()
    expectComment(comment!)
  })

  test('#findByUser - returns Comment[]', async () => {
    // When
    const comments = await service.findByAuthor(mockAuthor)

    // Then
    expect(comments.length).toBeGreaterThanOrEqual(1)

    const comment = comments.find(v => v.id === mockComment.id)
    expect(comment).not.toBeUndefined()
    expectComment(comment!)
  })

  test('#findById - retuns Comment', async () => {
    // When
    const comment = await service.findbyId(mockComment.id)

    // Then
    expectComment(comment!)
  })

  test('#update - returns Comment', async () => {
    // Given
    const commentForm: CommentForm = {
      body: faker.lorem.sentence()
    }

    // When
    await service.update(mockComment.id, commentForm)

    // Then
    const comment = await repository.findOne(mockComment.id, { relations: ['author'] })
    expectComment(comment!, Object.assign(mockComment, commentForm))
  })

  test('#remove - returns Comment', async () => {
    // When
    await service.remove(mockComment.id)

    // Then
    const comment = await repository.findOne(mockComment.id, { relations: ['author'] })
    expect(comment).toBeUndefined()
  })

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
