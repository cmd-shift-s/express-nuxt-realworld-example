import faker from 'faker'

export class TagService {
  async list() {
    return Promise.resolve(Array.from({ length: 10 }, () => faker.lorem.word()))
  }
}
