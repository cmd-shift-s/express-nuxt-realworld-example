import * as faker from 'faker'
import { User } from '~/server/entity'

export function generateUser(email: string): User {
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
