import { JsonController, Get, QueryParam, Param, Post, BodyParam, CurrentUser, Delete, NotFoundError, BadRequestError } from 'routing-controllers'
import debug from 'debug'
import { ArticleService, CommentService } from '../services'
import { ArticleFormData } from '~/models'
import { User } from '../entity'

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
    @QueryParam('limit') limit: number = 20,
    @CurrentUser() curUser?: User
  ) {
    this.logger(`articles`)

    const articles = await this.articleService.list(limit, curUser)
    const articleCount = await this.articleService.count()

    return {
      articles,
      articleCount
    }
  }

  @Post()
  public async publish(
    @BodyParam('article', { required: true }) articleForm: ArticleFormData,
    @CurrentUser({ required: true }) curUser: User
  ) {
    this.logger(`publish`, articleForm)

    const article = await this.articleService.save(articleForm, curUser)

    return {
      article
    }
  }

  @Get('/:slug')
  public async read(
    @Param('slug') slug: string
  ) {
    this.logger('slug', slug)

    const article = await this.articleService.findBySlug(slug)

    // TODO: check article not null

    return { article }
  }

  @Get('/:slug/comments')
  public async comments(
    @Param('slug') slug: string
  ) {
    this.logger(`comments`, slug)

    // TODO: check article not null

    const comments = await this.commentService.list(slug)

    return {
      comments
    }
  }

  @Delete('/:slug')
  public async removeArticle(
    @Param('slug') slug: string,
    @CurrentUser({ required: true }) curUser: User
  ) {

    const article = await this.articleService.findBySlug(slug)

    if (!article) {
      throw new NotFoundError(`Not Found Article: ${slug}`)
    }

    if (article.author && article.author.username === curUser.username) {
      await this.articleService.remove(article)
    } else {
      throw new BadRequestError()
    }

    return {
      article
    }
  }
}
