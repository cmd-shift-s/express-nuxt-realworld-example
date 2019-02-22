import faker from 'faker'

export class ArticleService {
  generateArticle() {
    const updatedAt = faker.date.past()
    return {
      slug: faker.lorem.slug(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      body: faker.lorem.text(),
      tagList: Array.from(
          { length: faker.random.number({min: 0, max:10}) },
          () => faker.lorem.word()),
      createdAt: faker.date.past(undefined, updatedAt),
      updatedAt: updatedAt,
      favorited: faker.random.boolean(),
      favoritesCount: faker.random.number(),
      author: {
        username: faker.lorem.word(),
        bio: faker.lorem.sentence(),
        image: faker.image.avatar(),
        following: faker.random.boolean()
      }
    }
  }

  async list() {
    return Promise.resolve(Array.from({length: faker.random.number({ max: 10})}, this.generateArticle));
  }
}
