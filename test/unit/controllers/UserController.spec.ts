import { generateUser } from '../fixtures'
import { UserController } from '~/server/controllers'
import { UserService } from '~/server/services'
import { UnprocessableEntityError } from '~/server/common/errors'

describe('UserController', () => {

  let ctrl: UserController
  let userService: UserService

  beforeEach(() => {
    userService = new UserService({} as any)
    ctrl = new UserController(userService)
  })

  test('#login - return user', async () => {
    // Given
    const email = 'test@email.com'
    const mockUser = generateUser(email)
    userService.findByEmail = jest.fn().mockImplementation(() => mockUser)

    // When
    const data = await ctrl.login({
      email, password: 'Secret!'
    })

    // Then
    expect(userService.findByEmail).toHaveBeenCalledWith(email)
    expect(data).toHaveProperty('user')
    expect(data.user).toHaveProperty('email')
    expect(data.user.email).toBe(email)
    expect(data.user.token).not.toBeNull()
  })

  test('#login - throw UnprocessableEntityError #1 invalid password', async () => {
    // Given
    const email = 'test@email.com'
    const mockUser = generateUser(email)
    userService.findByEmail = jest.fn().mockImplementation(() => mockUser)

    // When
    await expect(ctrl.login({
      email, password: 'invalid password'
    })).rejects.toThrowError(new UnprocessableEntityError('email or password is invalid'))

    // Then
    expect(userService.findByEmail).toHaveBeenCalledWith(email)
  })

  test.skip('#login - throw UnprocessableEntityError #2 not found user', async () => {
    // Given
    const email = 'not_found@email.com'
    const mockUser = generateUser(email)
    userService.findByEmail = jest.fn().mockImplementation(() => mockUser)

    // When
    await expect(ctrl.login({
      email, password: 'invalid password'
    })).rejects.toThrowError(new UnprocessableEntityError('email or password is invalid'))

    // Then
    expect(userService.findByEmail).toHaveBeenCalledWith(email)
  })

  test('#me - return user', async () => {
    // Given
    const email = 'test@email.com'
    const mockUser = generateUser(email)
    userService.findByEmail = jest.fn().mockImplementation(() => mockUser)

    // When
    const data = await ctrl.me(mockUser)

    // Then
    expect(userService.findByEmail).toHaveBeenCalledWith(email)
    expect(data).toHaveProperty('user')
    expect(data.user).toEqual(mockUser)
  })

  test('#update - return user', async () => {
    // Given
    const email = 'test@email.com'
    const mockUser = generateUser(email)
    const updateUser = {
      username: mockUser.username + '!'
    }
    userService.update = jest.fn().mockImplementation(() => true)

    // When
    const data = await ctrl.update(mockUser, updateUser)

    // Then
    expect(userService.update).toHaveBeenCalledWith(mockUser.id, updateUser)

    expect(data).toHaveProperty('user')
    expect(data.user.username).toEqual(updateUser.username)
    expect(data.user.token).not.toBeNull()
  })
})
