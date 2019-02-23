import faker from 'faker'
import { Article } from '~/models'

export class ArticleService {
  generateArticle(): Article {
    const updatedAt = faker.date.past()
    return {
      slug: faker.lorem.slug(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      body: faker.lorem.text(),
      tagList: Array.from(
          { length: faker.random.number({min: 0, max:10}) },
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
    return Promise.resolve(Array.from({length: limit}, this.generateArticle));
  }

  async count(limit: number): Promise<number> {
    return Promise.resolve(limit ? limit : faker.random.number())
  }
}
