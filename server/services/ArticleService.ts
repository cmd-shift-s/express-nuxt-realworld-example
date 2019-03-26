import faker from 'faker'
import { Article, ArticleFormData } from '~/models'
import { User } from '../entity'

export class ArticleService {
  generateArticle(slug: string = faker.lorem.slug()): Article {
    const updatedAt = faker.date.past()
    return {
      slug,
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      body: faker.lorem.text(),
      tagList: Array.from(
          { length: faker.random.number({ min: 0, max: 10 }) },
          () => faker.lorem.word()),
      createdAt: faker.date.past(undefined, updatedAt).toISOString(),
      updatedAt: updatedAt.toISOString(),
      favorited: faker.random.boolean(),
      favoritesCount: faker.random.number(),
      author: {
        username: faker.internet.userName(),
        bio: faker.lorem.sentence(),
        image: faker.image.avatar(),
        following: faker.random.boolean()
      }
    }
  }

  async list(limit: number): Promise<Article[]> {
    return Promise.resolve(Array.from({ length: limit }, this.generateArticle))
  }

  async count(limit: number): Promise<number> {
    return Promise.resolve(limit ? limit : faker.random.number())
  }

  async read(slug: string): Promise<Article> {
    return Promise.resolve(this.generateArticle(slug))
  }

  async save(articleForm: ArticleFormData, author: User): Promise<Article> {
    const article = this.generateArticle()

    Object.assign(article, articleForm)
    Object.assign(article.author, author)

    return Promise.resolve(article)
  }
}
