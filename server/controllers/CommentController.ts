import { JsonController, Get, Param, NotFoundError, Post, CurrentUser, BodyParam, Delete, Put, InternalServerError, ForbiddenError } from 'routing-controllers'
import debug from 'debug'
import { CommentService, ArticleService } from '../services'
import { User, CommentForm } from '../entity'

@JsonController('/articles/:slug/comments')
export class CommentController {
  private logger = debug('server:controllers:comment')

  constructor(
    private articleService: ArticleService,
    private commentService: CommentService
  ) {}

  @Get()
  public async list(
    @Param('slug') slug: string
  ) {
    this.logger(`list`)

    const article = await this.articleService.findBySlug(slug)
    if (!article) {
      throw new NotFoundError(`Not Found Article: ${slug}`)
    }

    const comments = await this.commentService.findByArticle(article)

    return {
      comments
    }
  }

  @Post()
  public async save(
    @CurrentUser({ required: true }) curUser: User,
    @Param('slug') slug: string,
    @BodyParam('comment', { required: true }) commentForm: CommentForm
  ) {
    this.logger(`save`, commentForm)

    const article = await this.articleService.findBySlug(slug)
    if (!article) {
      throw new NotFoundError(`Not Found Article: ${slug}`)
    }

    const { id } = await this.commentService.create(commentForm, article, curUser)

    const comment = await this.commentService.findbyId(id)

    return { comment }
  }

  @Put('/:id')
  public async update(
    @CurrentUser({ required: true }) curUser: User,
    @BodyParam('comment', { required: true }) commentForm: CommentForm,
    @Param('id') id: number
  ) {
    this.logger(`put`, commentForm)

    const comment = await this.commentService.findbyId(id)
    if (!comment) {
      throw new NotFoundError(`Not Found Comment: ${id}`)
    }

    if (comment.author.id !== curUser.id) {
      throw new ForbiddenError()
    }

    try {
      const result = await this.commentService.update(id, commentForm)
      if (!result) {
        // throw failed to update
      }

      const updatedComment = await this.commentService.findbyId(id)
      return { comment: updatedComment }
    } catch (e) {
      throw new InternalServerError('Failed to update')
    }
  }

  @Delete('/:id')
  public async remove(
    @CurrentUser({ required: true }) curUser: User,
    @Param('id') id: number
  ) {
    this.logger(`remove`)

    const comment = await this.commentService.findbyId(id)
    if (!comment) {
      throw new NotFoundError(`Not Found Comment: ${id}`)
    }

    if (comment.author.id !== curUser.id) {
      throw new ForbiddenError()
    }

    await this.commentService.remove(id)

    return { comment }
  }
}
