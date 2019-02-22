import { JsonController, Get } from 'routing-controllers'
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
  public async articles() {
    this.logger(`articles`)

    const articles = await this.ArticleService.list();

    return {
      articles,
      articleCount: articles.length
    }
  }
}
