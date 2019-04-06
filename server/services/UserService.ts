import { Repository, UpdateResult } from 'typeorm'
import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { User } from '../entity'
import { compare, hash } from 'bcryptjs'

export type UserRegistInfo = Pick<User, 'email' | 'username' | 'password'>
export type UserUpdateInfo = Partial<Pick<User, 'bio' | 'email' | 'password' | 'image' | 'username' | 'roles'>>

@Service()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne(id)
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email }
    })
  }

  findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { username }
    })
  }

  async save(info: UserRegistInfo): Promise<User> {
    info.password = await hash(info.password, 8)
    return this.userRepository.save(info)
  }

  async update(id: number, info: UserUpdateInfo): Promise<UpdateResult> {
    // FIXME: Update Result is always the same
    // UpdateResult { generatedMaps: [], raw: [] }
    if (info.password) {
      info.password = await hash(info.password, 8)
    }
    return this.userRepository.update(id, info)
  }

  async isFollowing(id: number, followerId: number): Promise<boolean> {
    const count = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.followers', 'follower')
      .where('user.id = :id', { id })
      .andWhere('follower.id = :followerId', { followerId })
      .getCount()

    return Boolean(count)
  }

  follow(id: number, followerId: number) {
    return this.userRepository.createQueryBuilder()
      .relation('followers')
      .of(id)
      .add(followerId)
  }

  unfollow(id: number, followerId: number) {
    return this.userRepository.createQueryBuilder()
      .relation('followers')
      .of(id)
      .remove(followerId)
  }

  async checkIfUnencryptedPasswordIsValid(id: number, password: string) {
    const user = await this.userRepository.findOne(id, { select: ['password'] })
    return compare(password, user!.password)
  }

}
