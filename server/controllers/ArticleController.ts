import { JsonController, Get, QueryParam, Param } from 'routing-controllers'
import debug from 'debug'
import { ArticleService, CommentService } from '../services';

@JsonController('/articles')
export class ArticleController {
  private logger = debug('server:controllers:article')

  constructor(
    private articleService: ArticleService,
    private commentService: CommentService
  ) {}

  /**
   * Articles
   */
  @Get()
  public async articles(
    @QueryParam('limit') limit: number = 20
  ) {
    this.logger(`articles`)

    const articles = await this.articleService.list(limit)
    const articleCount = await this.articleService.count(limit)

    return {
      articles,
      articleCount
    }
  }

  @Get('/:slug/comments')
  public async comments(
    @Param('slug') slug: string
  ) {
    this.logger(`comments`, slug)

    const comments = await this.commentService.list(slug)

    return {
      comments
    }
  }
}
