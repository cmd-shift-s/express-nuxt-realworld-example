import { ArticleController } from '~/server/controllers'
import { ArticleService } from '~/server/services'

describe('TagController', () => {

  let ctrl: ArticleController
  let articleService: ArticleService

  beforeEach(() => {
    articleService = new ArticleService()
    ctrl = new ArticleController(articleService)
  })

  test('should return articles and articleCount', async () => {
    // Given
    const mockArticles = Array.from({length: 2}, () => articleService.generateArticle())
    articleService.list = jest.fn().mockImplementation(() => mockArticles)

    // When
    // const ctrl = new TagController(tagService)
    const data = await ctrl.articles()

    // Then
    expect(articleService.list).toHaveBeenCalled()
    expect(data).toHaveProperty('articles')
    expect(data).toHaveProperty('articleCount')
    expect(data.articles).toBe(mockArticles)
    expect(data.articleCount).toBe(mockArticles.length)
  })
})
