import { ArticleController } from '~/server/controllers'
import { ArticleService, CommentService } from '~/server/services'

describe('ArticleController', () => {

  let ctrl: ArticleController
  let articleService: ArticleService
  let commentservice: CommentService

  beforeEach(() => {
    articleService = new ArticleService()
    commentservice = new CommentService()
    ctrl = new ArticleController(articleService, commentservice)
  })

  test('should return articles and articleCount', async () => {
    // Given
    const mockArticles = Array.from({length: 2}, () => articleService.generateArticle())
    articleService.list = jest.fn().mockImplementation(() => mockArticles)

    // When
    const data = await ctrl.articles()

    // Then
    expect(articleService.list).toHaveBeenCalled()
    expect(data).toHaveProperty('articles')
    expect(data).toHaveProperty('articleCount')
    expect(data.articles).toBe(mockArticles)
    expect(data.articleCount).not.toBeNaN()
  })

  test('should return comments', async () => {
    // Given
    const slug = 'article-slug'
    const mockComments = Array.from({length: 2}, () => commentservice.generateComment(slug))
    commentservice.list = jest.fn().mockImplementation(() => mockComments)

    // When
    const data = await ctrl.comments(slug)

    // Then
    expect(commentservice.list).toHaveBeenCalledWith(slug)
    expect(data).toHaveProperty('comments')
    expect(data.comments).toBe(mockComments)
  })

  test('should return article', async () => {
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
})
