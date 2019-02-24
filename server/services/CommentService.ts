import faker from 'faker'
import { Comment } from '~/models'

export class CommentService {
  generateComment(_slug: string): Comment {
    const updatedAt = faker.date.past()
    return {
      id: faker.random.number(),
      createdAt: faker.date.past(undefined, updatedAt).toISOString(),
      updatedAt: updatedAt.toISOString(),
      body: faker.lorem.paragraph(),
      author: {
        username: faker.internet.userName(),
        bio: faker.lorem.sentence(),
        image: faker.image.avatar(),
        following: faker.random.boolean()
      }
    }
  }

  async list(slug: string): Promise<Comment[]> {
    return Promise.resolve(
      Array.from(
        {length: faker.random.number({max: 30})},
        () => this.generateComment(slug)));
  }
}
