import { JsonController, Get, QueryParam, Param, Post, BodyParam, CurrentUser, Delete, NotFoundError, BadRequestError, InternalServerError, QueryParams } from 'routing-controllers'
import debug from 'debug'
import { ArticleService } from '../services'
import { ArticleFormData, ArticleSearchParams } from '~/models'
import { User } from '../entity'

@JsonController('/articles')
export class ArticleController {
  private logger = debug('server:controllers:article')

  constructor(
    private articleService: ArticleService
  ) {}

  /**
   * Articles
   */
  @Get()
  public async articles(
    @QueryParams() params: ArticleSearchParams,
    @CurrentUser() curUser?: User
  ) {
    this.logger(`articles`, params)

    const [articles, articleCount] = await this.articleService.list(params, curUser)

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
    @Param('slug') slug: string,
    @CurrentUser() curUser?: User
  ) {
    this.logger('slug', slug)

    const article = await this.articleService.findBySlug(slug, curUser)

    if (!article) {
      throw new NotFoundError(`Not Found Article: ${slug}`)
    }

    return {
      article
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

  @Post('/:slug/favorite')
  public async favorite(
    @Param('slug') slug: string,
    @CurrentUser({ required: true }) curUser: User
  ) {
    const article = await this.articleService.findBySlug(slug, curUser)

    if (!article) {
      throw new NotFoundError(`Not Found Article: ${slug}`)
    }

    if (article.favorited) {
      return { article }
    }

    try {
      await this.articleService.favorite(article.id, curUser.id)

      article.favorited = true
      article.favoritesCount++
    } catch (e) {
      throw new InternalServerError('failed to update')
    }

    return { article }
  }

  @Delete('/:slug/favorite')
  public async unfavorite(
    @Param('slug') slug: string,
    @CurrentUser({ required: true }) curUser: User
  ) {
    const article = await this.articleService.findBySlug(slug, curUser)

    if (!article) {
      throw new NotFoundError(`Not Found Article: ${slug}`)
    }

    if (!article.favorited) {
      return { article }
    }

    try {
      await this.articleService.unfavorite(article.id, curUser.id)

      article.favorited = false
      article.favoritesCount--
    } catch (e) {
      throw new InternalServerError('failed to update')
    }

    return { article }
  }
}
