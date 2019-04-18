import { ArticleFormData, ArticleSearchParams } from '~/models'
import { User, Article } from '../entity'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import slugify from 'slugify'
import { Inject } from 'typedi'
import { UserService } from './UserService'

export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>
  ) {}

  async list(params: ArticleSearchParams, user?: User): Promise<[Article[], number]> {
    const { tag, author, favorited } = params

    const limit = Number.parseInt(params.limit || '10', 10) || 10
    const offset = (Number.parseInt(params.offset || '0', 10) || 0) * limit

    const q = this.articleRepository.createQueryBuilder('article')
      .loadRelationCountAndMap('article.favoritesCount', 'article.favoritedUsers', 'favoritedUsers')
      .leftJoinAndSelect('article.author', 'author')

    if (tag) {
      q.andWhere('article.tagList in (:...tagList)', { tagList: [tag] })
    }
    if (author) {
      q.andWhere('author.username = :author', { author })
    }
    if (favorited) {
      q.andWhere(`article.id in (select fa."articleId" from "public"."user" u, user_favorited_articles_article fa where u."username" = :favorited and fa."userId" = u."id")`, { favorited })
    }

    if (user) {
      q.loadRelationCountAndMap('article.favorited', 'article.favoritedUsers', 'favorited', qb => {
        return qb.andWhere('favorited.id = :userId', { userId: user.id })
      })
    }

    return q
      .limit(limit)
      .offset(offset)
      .orderBy('article.createdAt', 'DESC')
      .getManyAndCount()
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
