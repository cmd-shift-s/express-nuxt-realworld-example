import { ArticleFormData } from '~/models'
import { User, Article } from '../entity'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import slugify from 'slugify'

export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>
  ) {}

  list(limit: number, user?: User): Promise<Article[]> {
    const q = this.articleRepository.createQueryBuilder('article')
      .loadRelationCountAndMap('article.favoritesCount', 'article.favoritedUsers', 'favoritedUsers')
      .leftJoinAndSelect('article.author', 'author')

    if (user) {
      q.loadRelationCountAndMap('article.favorited', 'article.favoritedUsers', 'favorited', qb => {
        return qb.andWhere('favorited.id = :userId', { userId: user.id })
      })
    }

    return q.limit(limit).getMany()
  }

  count(): Promise<number> {
    return this.articleRepository.count()
  }

  findById(id: number): Promise<Article | undefined> {
    return this.articleRepository.findOne(id)
  }

  findBySlug(slug: string, user?: User): Promise<Article | undefined> {
    const q = this.articleRepository.createQueryBuilder('article')
      .loadRelationCountAndMap('article.favoritesCount', 'article.favoritedUsers', 'favoritedUsers')
      .leftJoinAndSelect('article.author', 'author')
      .loadRelationCountAndMap('author.followerCount', 'author.followers')
      .where({ slug })

    if (user) {
      q.loadRelationCountAndMap('article.favorited', 'article.favoritedUsers', 'favorited', qb => {
        return qb.andWhere('favorited.id = :userId', { userId: user.id })
      })
      q.loadRelationCountAndMap('author.following', 'author.followers', 'follower', qb => {
        return qb.andWhere('follower.id = :userId', { userId: user.id })
      })
    }

    return q.getOne()
  }

  save(articleForm: ArticleFormData, author: User): Promise<Article> {
    const slug = slugify(articleForm.title)

    return this.articleRepository.save({ slug, ...articleForm, author })
  }

  remove(article: Article): Promise<Article> {
    return this.articleRepository.remove(article)
  }

  async isExistsBySlug(slug: string): Promise<boolean> {
    const count = await this.articleRepository.count({
      where: { slug }
    })

    return !!count
  }

  favorite(id: number, userId: number) {
    return this.articleRepository.createQueryBuilder()
      .relation('favoritedUsers')
      .of(id)
      .add(userId)
  }

  unfavorite(id: number, userId: number) {
    return this.articleRepository.createQueryBuilder()
      .relation('favoritedUsers')
      .of(id)
      .remove(userId)
  }

}
