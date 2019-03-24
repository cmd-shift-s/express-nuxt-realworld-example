import { ProfileController } from '~/server/controllers'
import { UserService } from '~/server/services'
import { generateUser } from '../fixtures'
import { NotFoundError } from 'routing-controllers'

describe('ProfileController', () => {

  let ctrl: ProfileController
  let userService: UserService

  beforeEach(() => {
    userService = new UserService({} as any)
    ctrl = new ProfileController(userService)
  })

  test('#profile - returns Profile', async () => {
    // Given
    const email = 'test@email.com'
    const mockUser = generateUser(email)
    const username = mockUser.username
    userService.findByUsername = jest.fn().mockImplementation(() => mockUser)
    userService.isFollowing = jest.fn()

    const profile = {
      username,
      bio: mockUser.bio,
      image: mockUser.image,
      following: false
    }

    // When
    const data = await ctrl.profile(username)

    // Then
    expect(userService.findByUsername).toHaveBeenCalledWith(username)
    expect(userService.isFollowing).not.toHaveBeenCalled()
    expect(data).toHaveProperty('profile')
    expect(data.profile).toEqual(profile)
  })

  test('#profile - returns Profile with following', async () => {
    // Given
    const email = 'test@email.com'
    const mockUser = generateUser(email)
    const curUser = generateUser('curuser@email.com')
    const username = mockUser.username
    userService.findByUsername = jest.fn().mockImplementation(() => mockUser)
    userService.isFollowing = jest.fn().mockImplementation(() => true)

    const profile = {
      username,
      bio: mockUser.bio,
      image: mockUser.image,
      following: true
    }

    // When
    const data = await ctrl.profile(username, curUser)

    // Then
    expect(userService.findByUsername).toHaveBeenCalledWith(username)
    expect(userService.isFollowing).toHaveBeenCalled()
    expect(data).toHaveProperty('profile')
    expect(data.profile).toEqual(profile)
  })

  test('#profile - throws NotFound', async () => {
    // Given
    const username = 'not_found_user'
    userService.findByUsername = jest.fn().mockImplementation(() => null)
    userService.isFollowing = jest.fn()

    // When
    await expect(ctrl.profile(username))

    // Then
    .rejects.toThrow(NotFoundError)

    expect(userService.findByUsername).toHaveBeenCalledWith(username)
    expect(userService.isFollowing).not.toHaveBeenCalled()
  })

  test('#follow - returns Profile', async () => {
    const email = 'test@email.com'
    const mockUser = generateUser(email)
    const curUser = generateUser('curuser@email.com')
    const username = mockUser.username
    userService.findByUsername = jest.fn().mockImplementation(() => mockUser)
    userService.follow = jest.fn()

    const profile = {
      username,
      bio: mockUser.bio,
      image: mockUser.image,
      following: true
    }

    // When
    const data = await ctrl.follow(username, curUser)

    // Then
    expect(userService.findByUsername).toHaveBeenCalledWith(username)
    expect(userService.follow).toHaveBeenCalledWith(mockUser.id, curUser.id)
    expect(data).toHaveProperty('profile')
    expect(data.profile).toEqual(profile)
  })

  test('#follow - throws NotFound', async () => {
    // Given
    const username = 'not_found_user'
    userService.findByUsername = jest.fn().mockImplementation(() => null)
    userService.follow = jest.fn()

    // When
    await expect(ctrl.follow(username, null as any))

    // Then
    .rejects.toThrow(NotFoundError)

    expect(userService.findByUsername).toHaveBeenCalledWith(username)
    expect(userService.follow).not.toHaveBeenCalled()
  })

  test('#unfollow - returns Profile', async () => {
    const email = 'test@email.com'
    const mockUser = generateUser(email)
    const curUser = generateUser('curuser@email.com')
    const username = mockUser.username
    userService.findByUsername = jest.fn().mockImplementation(() => mockUser)
    userService.unfollow = jest.fn()

    const profile = {
      username,
      bio: mockUser.bio,
      image: mockUser.image,
      following: false
    }

    // When
    const data = await ctrl.unfollow(username, curUser)

    // Then
    expect(userService.findByUsername).toHaveBeenCalledWith(username)
    expect(userService.unfollow).toHaveBeenCalledWith(mockUser.id, curUser.id)
    expect(data).toHaveProperty('profile')
    expect(data.profile).toEqual(profile)
  })

  test('#unfollow - throws NotFound', async () => {
    // Given
    const username = 'not_found_user'
    userService.findByUsername = jest.fn().mockImplementation(() => null)
    userService.unfollow = jest.fn()

    // When
    await expect(ctrl.unfollow(username, null as any))

    // Then
    .rejects.toThrow(NotFoundError)

    expect(userService.findByUsername).toHaveBeenCalledWith(username)
    expect(userService.unfollow).not.toHaveBeenCalled()
  })

})
