import faker from 'faker'
import { Profile } from '~/models'

export class ProfileService {
  generateProfile(username: string): Profile {
    return {
      username,
      bio: faker.lorem.sentence(),
      image: faker.image.avatar(),
      following: faker.random.boolean()
    }
  }

  async profile(username: string): Promise<Profile> {
    return Promise.resolve(this.generateProfile(username))
  }
}
