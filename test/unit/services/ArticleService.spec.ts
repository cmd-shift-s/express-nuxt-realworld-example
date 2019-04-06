import { createConnection, Connection, Repository } from 'typeorm'
import { ArticleService } from '~/server/services'
import { generateJoinedUser } from '../../utils'
import { User, Article } from '~/server/entity'
import faker from 'faker'
import { ArticleFormData } from '~/models'

describe('ArticleService', () => {
  let conn: Connection
  let repository: Repository<Article>
  let service: ArticleService
  let user: User
  let _article: Article

  beforeAll(async () => {
    conn = await createConnection()
    if (!conn || !conn.isConnected) {
      fail('cannot connect database')
    }

    repository = conn.getRepository(Article)
    service = new ArticleService(repository)
  })

  beforeEach(async () => {
    if (!conn || !conn.isConnected) {
      fail('cannot connect database')
    }

    user = await generateJoinedUser(conn) as User
    _article = await repository.save({
      slug: faker.lorem.slug(),
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      tagList: Array.from({ length: 3 }, () => faker.lorem.word()),
      author: user
    })
  })

  afterEach(async () => {
    if (conn && conn.isConnected) {
      if (_article) {
        await repository.remove(_article)
      }
      await conn.getRepository(User).remove(user)
    }
  })

  afterAll(() => {
    if (conn && conn.isConnected) {
      return conn.close()
    }
  })

  describe('#save', () => {
    let articleForm: ArticleFormData
    let article: Article

    beforeEach(() => {
      articleForm = {
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        tagList: Array.from({ length: 3 }, () => faker.lorem.word())
      }
    })

    afterEach(async () => {
      if (article) {
        await repository.remove(article)
      }
    })

    test('returns Article', async () => {
      // When
      article = await service.save(articleForm, user)

      // Then
      expect(article).not.toBeNull()
      expect(article.title).toEqual(articleForm.title)
      expect(article.description).toEqual(articleForm.description)
      expect(article.body).toEqual(articleForm.body)
      expect(article.tagList).toEqual(expect.arrayContaining(articleForm.tagList))
    })
  })

  describe('#list', () => {
    test('returns Article[]', async () => {
      // When
      const articles = await service.list(10, user)

      // Then
      expect(articles.length).toBeGreaterThanOrEqual(1)

      const article = articles.find(it => it.id === _article.id) as Article
      expect(article).not.toBeUndefined()
      expect(article.title).toEqual(_article.title)
      expect(article.description).toEqual(_article.description)
      expect(article.body).toEqual(_article.body)
      expect(article.tagList).toEqual(expect.arrayContaining(_article.tagList))
      expect(article).toHaveProperty('author')
      expect(article.author).not.toHaveProperty('password')
    })
  })

  describe('#remove', () => {
    let article: Article

    beforeEach(async () => {
      const articleForm = {
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        tagList: Array.from({ length: 3 }, () => faker.lorem.word())
      }

      article = await service.save(articleForm, user)
    })

    test('returns Article', async () => {
      // When
      const removedArticle = await service.remove(article)

      // Then
      expect(removedArticle).toEqual(article)
    })

    // throws SubjectWithoutIdentifierError: Internal error
    test.skip('throws NotFound', async () => {
      // Given
      await service.remove(article)

      // When
      await expect(service.remove(_article))

      // Then
      .rejects.toThrowError()
    })
  })

  describe('#findById', () => {
    test('returns undefined', async () => {
      // When
      const article = await service.findById(0)

      // Then
      expect(article).toBeUndefined()
    })

    test('returns Article', async () => {
      // When
      const article = await service.findById(_article.id) as Article

      // Then
      expect(article).not.toBeUndefined()
      expect(article.slug).toEqual(_article.slug)
      expect(article.body).toEqual(_article.body)
      expect(article.description).toEqual(_article.description)
      expect(article.title).toEqual(_article.title)
      expect(article.tagList).toEqual(expect.arrayContaining(_article.tagList))
      expect(article).not.toHaveProperty('author')
      // expect(article.author).not.toHaveProperty('password')
    })
  })

  describe('#findBySlug', () => {
    test('returns undefined', async () => {
      // When
      const article = await service.findBySlug('not_found_slug')

      // Then
      expect(article).toBeUndefined()
    })

    test('returns Article', async () => {
      // When
      const article = await service.findBySlug(_article.slug)

      // Then
      expect(article).not.toBeUndefined()
      expect(article!.id).toEqual(_article.id)
      expect(article!.body).toEqual(_article.body)
      expect(article!.description).toEqual(_article.description)
      expect(article!.tagList).toEqual(expect.arrayContaining(_article.tagList))
      expect(article!.slug).toEqual(_article.slug)
      expect(article!.createdAt).toEqual(_article.createdAt)
      expect(article!.updatedAt).toEqual(_article.updatedAt)
      expect(article!.author).not.toHaveProperty('password')
    })
  })
})
