import { createConnection, Connection, Repository } from 'typeorm'
import { UserService, UserUpdateInfo } from '~/server/services'
import { generateJoinedUser, JoinedUser } from '../../utils'
import { User } from '~/server/entity'
import faker from 'faker'

describe('UserService', () => {
  let conn: Connection
  let repository: Repository<User>
  let service: UserService
  let user: JoinedUser

  beforeAll(async () => {
    conn = await createConnection()
    if (!conn || !conn.isConnected) {
      fail('cannot connect database')
    }

    repository = conn.getRepository(User)
    service = new UserService(repository)
  })

  beforeEach(async () => {
    if (!conn || !conn.isConnected) {
      fail('cannot connect database')
    }

    user = await generateJoinedUser(conn)
  })

  afterEach(() => {
    if (user && conn && conn.isConnected) {
      return conn.getRepository(User).remove(user as User)
    }
  })

  afterAll(() => {
    if (conn && conn.isConnected) {
      return conn.close()
    }
  })

  /**
   * findById
   */

  describe('#findById', () => {
    test('returns User', async () => {
      // When
      const joinedUser = await service.findById(user.id)

      // Then
      expect(joinedUser).not.toBeNull()
      expect(joinedUser!.email).toBe(user.email)
      expect(joinedUser!.username).toBe(user.username)
    })

    test('returns undefined', async () => {
      // When
      const joinedUser = await service.findById(0)

      // Then
      expect(joinedUser).toBeUndefined()
    })
  })

  /**
   * findByEmail
   */

  describe('#findByEmail', () => {
    test('returns User', async () => {
      // When
      const joinedUser = await service.findByEmail(user.email)

      // Then
      expect(joinedUser).not.toBeNull()
      expect(joinedUser!.email).toBe(user.email)
      expect(joinedUser!.username).toBe(user.username)
    })

    test('returns undefined', async () => {
      // When
      const joinedUser = await service.findByEmail('')

      // Then
      expect(joinedUser).toBeUndefined()
    })
  })

  /**
   * findByUsername
   */

  describe('#findByUsername', () => {
    test('returns User', async () => {
      // When
      const joinedUser = await service.findByUsername(user.username)

      // Then
      expect(joinedUser).not.toBeNull()
      expect(joinedUser!.email).toBe(user.email)
      expect(joinedUser!.username).toBe(user.username)
    })

    test('returns undefined', async () => {
      // When
      const joinedUser = await service.findByUsername('')

      // Then
      expect(joinedUser).toBeUndefined()
    })
  })

  /**
   * save
   */

  describe('#save', () => {
    test('throws Duplicate(email)', async () => {
      // Given
      const registUser = {
        email: user.email,
        username: faker.internet.userName(),
        password: faker.internet.password()
      }

      // When
      await expect(service.save(registUser))

      // Then
      .rejects.toThrowError('duplicate key')
    })

    test('throws Duplicate(username)', async () => {
      // Given
      const registUser = {
        email: faker.internet.email(),
        username: user.username,
        password: faker.internet.password()
      }

      // When
      await expect(service.save(registUser))

      // Then
      .rejects.toThrowError('duplicate key')
    })

    test('returns User', async () => {
      // Given
      const registUser = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password()
      }

      // When
      const createdUser = await service.save(registUser)

      // Then
      expect(createdUser).not.toBeNull()
      expect(createdUser.email).toEqual(registUser.email)
      expect(createdUser.username).toEqual(registUser.username)
      expect(createdUser.password).toEqual(registUser.password)

      await repository.remove(createdUser)
    })
  })

  /**
   * update
   */

  describe('#update', () => {

    test('throws NotFound', async () => {
      // When
      const updateResult = await service.update(0, {})

      // Then
      expect(updateResult.raw.length).toBe(0)
    })

    test('returns UpdateResult', async () => {
      // Given
      const updateUser: UserUpdateInfo = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        username: faker.internet.userName(),
        bio: faker.lorem.sentence(),
        image: faker.image.avatar(),
        roles: ['User'],
      }

      // When
      const updateResult = await service.update(user.id, updateUser)

      // Then
      // typeorm에서 postgres의 업데이트 결과를 받지 못함.
      expect(updateResult.raw.length).toBe(0) // toBe(1)

      const updatedUser = await repository.findOneOrFail(user.id)

      expect(updatedUser.email).toEqual(updateUser.email)
      expect(updatedUser.password).toEqual(updateUser.password)
      expect(updatedUser.username).toEqual(updateUser.username)
      expect(updatedUser.bio).toEqual(updateUser.bio)
      expect(updatedUser.image).toEqual(updateUser.image)
      expect(updatedUser.roles).toEqual(expect.arrayContaining(updateUser.roles!))
    })
  })

  /**
   * follow
   */

  describe('#follow', () => {
    test('add relation', async () => {
      // Given
      const follower = await generateJoinedUser(conn)

      // When
      await service.follow(user.id, follower.id)

      // Then
      const count = await repository.createQueryBuilder('user')
        .leftJoinAndSelect('user.followers', 'follower')
        .where('user.id = :id', { id: user.id })
        .andWhere('follower.id = :followerId', { followerId: follower.id })
        .getCount()

      expect(count).toBe(1)
    })

    test('self relation', async () => {
      // When
      await service.follow(user.id, user.id)

      // Then
      const count = await repository.createQueryBuilder('user')
        .leftJoinAndSelect('user.followers', 'follower')
        .where('user.id = :id', { id: user.id })
        .andWhere('follower.id = :followerId', { followerId: user.id })
        .getCount()

      expect(count).toBe(1)
    })

    test('throws duplicate', async () => {
      // Given
      await service.follow(user.id, user.id)

      // When
      await expect(service.follow(user.id, user.id))

      // Then
      .rejects.toThrowError('duplicate key')
    })
  })

  /**
   * unfollow
   */

  describe('#unfollow', () => {
    test('remove relation', async () => {
      // Given
      const follower = await generateJoinedUser(conn)
      await service.follow(user.id, follower.id)
      expect(await service.isFollowing(user.id, follower.id)).toBeTruthy()

      // When
      await service.unfollow(user.id, follower.id)

      // Then
      const count = await repository.createQueryBuilder('user')
        .leftJoinAndSelect('user.followers', 'follower')
        .where('user.id = :id', { id: user.id })
        .andWhere('follower.id = :followerId', { followerId: follower.id })
        .getCount()

      expect(count).toBe(0)
    })

    test('not throws', async () => {
      // When
      await expect(service.unfollow(user.id, 0))

      // Then
      .resolves.toBeUndefined()
    })
  })

  /**
   * isFollowing
   */

  describe('#isFollowing', () => {
    test('returns true', async () => {
      // Given
      const follower = await generateJoinedUser(conn)
      await service.follow(user.id, follower.id)

      // When
      const isFollowing = await service.isFollowing(user.id, follower.id)

      // Then
      expect(isFollowing).toBeTruthy()
    })

    test('returns false', async () => {
      // When
      const isFollowing = await service.isFollowing(0, user.id)

      // Then
      expect(isFollowing).toBeFalsy()
    })
  })
})
