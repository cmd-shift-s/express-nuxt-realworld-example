import { InjectRepository } from 'typeorm-typedi-extensions'
import { Comment, CommentForm, User, Article } from '../entity'
import { Repository } from 'typeorm'

export class CommentService {

  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>
  ) { }

  create(comment: CommentForm, article: Article, author: User): Promise<Comment> {
    return this.commentRepository.save({ ...comment, article, author })
  }

  update(id: number, commentForm: CommentForm) {
    return this.commentRepository.update(id, commentForm)
  }

  findByArticle(article: Article): Promise<Comment[]> {
    return this.commentRepository.find({
      relations: ['author'],
      where: {
        article
      }
    })
  }

  findByAuthor(author: User): Promise<Comment[]> {
    return this.commentRepository.find({
      relations: ['author'],
      where: {
        author
      }
    })
  }

  remove(id: number) {
    return this.commentRepository.delete(id)
  }

  findbyId(id: number): Promise<Comment | undefined> {
    return this.commentRepository.findOne(id, {
      relations: ['author']
    })
  }
}
