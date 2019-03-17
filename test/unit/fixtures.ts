import * as faker from 'faker'
import { User } from '~/server/entity'

export function generateUser(email: string): User {
  return {
    email,
    password: 'Secret!',
    username: faker.internet.userName(),
    bio: faker.lorem.sentence(),
    image: faker.image.avatar(),
    roles: ['User']
  }
}
