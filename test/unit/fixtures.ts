import * as faker from 'faker'
import { User } from '~/server/entity'

export function generateUser(email: string): User {
  return {
    id: 1,
    email,
    password: 'Secret!',
    username: faker.internet.userName(),
    bio: faker.lorem.sentence(),
    image: faker.image.avatar(),
    roles: ['User']
  }
}
