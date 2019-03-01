import * as faker from 'faker'
import { User } from '~/models'

export class UserService {
  generateUser(email: string) {
    return {
      email,
      password: 'Secret!',
      username: faker.internet.userName(),
      bio: faker.lorem.sentence(),
      image: faker.image.avatar()
    }
  }

  find(email: string): Promise<User> {
    return Promise.resolve(this.generateUser(email))
  }
}
