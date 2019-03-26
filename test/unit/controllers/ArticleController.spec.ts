import { ArticleController } from '~/server/controllers'
import { ArticleService, CommentService } from '~/server/services'
import { generateUser } from '../fixtures'
import { ArticleFormData } from '~/models'
import faker from 'faker'

describe('ArticleController', () => {

  let ctrl: ArticleController
  let articleService: ArticleService
  let commentservice: CommentService

  beforeEach(() => {
    articleService = new ArticleService()
    commentservice = new CommentService()
    ctrl = new ArticleController(articleService, commentservice)
  })

  test('#articles - returns artiles and articleCount', async () => {
    // Given
    const mockArticles = Array.from({ length: 2 }, () => articleService.generateArticle())
    articleService.list = jest.fn().mockImplementation(() => mockArticles)
    articleService.count = jest.fn().mockImplementation(() => mockArticles.length)
    const defaultLimit = 20

    // When
    const data = await ctrl.articles()

    // Then
    expect(articleService.list).toHaveBeenCalledWith(defaultLimit)
    expect(articleService.count).toHaveBeenCalledWith(defaultLimit)
    expect(data.articles).toBe(mockArticles)
    expect(data.articleCount).not.toBeNaN()
  })

  test('#comments - returns comments', async () => {
    // Given
    const slug = 'article-slug'
    const mockComments = Array.from({ length: 2 }, () => commentservice.generateComment(slug))
    commentservice.list = jest.fn().mockImplementation(() => mockComments)

    // When
    const data = await ctrl.comments(slug)

    // Then
    expect(commentservice.list).toHaveBeenCalledWith(slug)
    expect(data).toHaveProperty('comments')
    expect(data.comments).toBe(mockComments)
  })

  test('#read - returns Article', async () => {
    // Given
    const slug = 'article-slug'
    const mockArticle = articleService.generateArticle(slug)
    articleService.read = jest.fn().mockImplementation(() => mockArticle)

    // When
    const data = await ctrl.read(slug)

    // Then
    expect(articleService.read).toHaveBeenCalledWith(slug)
    expect(data).toHaveProperty('article')
    expect(data.article).toHaveProperty('slug')
    expect(data.article.slug).toBe(slug)
  })

  test('#publish - returns Article', async () => {
    // Given
    const mockUser = generateUser('test@user.com')
    const mockArticle = articleService.generateArticle()
    const articleForm: ArticleFormData = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      tagList: Array.from({ length: 3 }, () => faker.lorem.word())
    }

    Object.assign(mockArticle, articleForm)
    Object.assign(mockArticle.author, mockUser)

    articleService.save = jest.fn().mockImplementation(() => mockArticle)

    // When
    const data = await ctrl.publish(articleForm, mockUser)

    // Then
    expect(articleService.save).toHaveBeenCalledWith(articleForm, mockUser)
    expect(data).toHaveProperty('article')
    expect(data.article.title).toEqual(articleForm.title)
    expect(data.article.description).toEqual(articleForm.description)
    expect(data.article.body).toEqual(articleForm.body)
    expect(data.article.tagList).toBe(articleForm.tagList)
    expect(data.article).toHaveProperty('author')
    expect(data.article.author.username).toEqual(mockUser.username)
    expect(data.article.author.bio).toEqual(mockUser.bio)
    expect(data.article.author.image).toEqual(mockUser.image)
  })
})
