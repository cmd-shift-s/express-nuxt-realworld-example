import * as faker from 'faker'
import { User, Article, Comment } from '~/server/entity'

export function generateUser(email: string = faker.internet.email()): User {
  const user = new User()
  user.id = faker.random.number()
  user.email = email
  user.password = faker.internet.password(),
  user.username = faker.internet.userName(),
  user.bio = faker.lorem.sentence(),
  user.image = faker.image.avatar(),
  user.roles = ['User'],
  user.createdAt = faker.date.past(),
  user.updatedAt = faker.date.recent()
  return user
}

export function generateArticle({ slug = faker.lorem.slug(), author = generateUser() }: Partial<Pick<Article, 'slug' | 'author'>> = {}): Article {
  const article = new Article()
  article.id = faker.random.number()
  article.slug = slug
  article.author = author
  article.title = faker.lorem.sentence(),
  article.description = faker.lorem.sentence(),
  article.body = faker.lorem.paragraph(),
  article.tagList = Array.from({ length: 3 }, () => faker.lorem.word())
  return article
}

export function generateComment({ article = generateArticle(), author = generateUser() }: Partial<Pick<Comment, 'author' | 'article'>> = {}): Comment {
  const comment = new Comment()
  comment.id = faker.random.number()
  comment.body = faker.lorem.paragraph()
  comment.article = article
  comment.author = author
  return comment
}
