import * as faker from 'faker'
import { User } from '~/models'

export class UserService {
  generateUser(email: string): User {
    return {
      email,
      password: 'Secret!',
      username: faker.internet.userName(),
      bio: faker.lorem.sentence(),
      image: faker.image.avatar(),
      roles: ['User']
    }
  }

  find(email: string): Promise<User> {
    return Promise.resolve(this.generateUser(email))
  }

  update(_user: User): Promise<boolean> {
    return Promise.resolve(true)
  }
}
