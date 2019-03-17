import { Repository } from 'typeorm'
import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { User } from '../entity'

export type UserRegistInfo = Pick<User, 'email' | 'username' | 'password'>

@Service()
export class UserService {

  constructor(
    @InjectRepository(User)
    private repository: Repository<User>
  ) {}

  find(email: string): Promise<User | undefined> {
    return this.repository.findOne({
      where: { email }
    })
  }

  save(info: UserRegistInfo): Promise<User> {
    return this.repository.save(info)
  }

  update(_user: User): Promise<boolean> {
    return Promise.resolve(true)
  }
}
