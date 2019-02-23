import { JsonController, Get, QueryParam } from 'routing-controllers'
import debug from 'debug'
import { ArticleService } from '../services';

@JsonController('/articles')
export class ArticleController {
  private logger = debug('server:controllers:article')

  constructor(private ArticleService: ArticleService) {}

  /**
   * Articles
   */
  @Get()
  public async articles(
    @QueryParam('limit') limit: number = 20
  ) {
    this.logger(`articles`)

    const articles = await this.ArticleService.list(limit);
    const articleCount = await this.ArticleService.count(limit)

    return {
      articles,
      articleCount
    }
  }
}
