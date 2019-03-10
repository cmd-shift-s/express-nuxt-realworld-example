import { UserController } from '~/server/controllers'
import { UserService } from '~/server/services'
import { UnprocessableEntityError } from '~/server/common/errors'

describe('UserController', () => {

  let ctrl: UserController
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
    ctrl = new UserController(userService)
  })

  test('#login - return user', async () => {
    // Given
    const email = 'test@email.com'
    const mockUser = userService.generateUser(email)
    userService.find = jest.fn().mockImplementation(() => mockUser)

    // When
    const data = await ctrl.login({
      email, password: 'Secret!'
    })

    // Then
    expect(userService.find).toHaveBeenCalledWith(email)
    expect(data).toHaveProperty('user')
    expect(data.user).toHaveProperty('email')
    expect(data.user.email).toBe(email)
    expect(data.user.token).not.toBeNull()
  })

  test('#login - throw UnprocessableEntityError #1 invalid password', async () => {
    // Given
    const email = 'test@email.com'
    const mockUser = userService.generateUser(email)
    userService.find = jest.fn().mockImplementation(() => mockUser)

    // When
    await expect(ctrl.login({
      email, password: 'invalid password'
    })).rejects.toThrowError(new UnprocessableEntityError('email or password is invalid'))

    // Then
    expect(userService.find).toHaveBeenCalledWith(email)
  })

  test.skip('#login - throw UnprocessableEntityError #2 not found user', async () => {
    // Given
    const email = 'not_found@email.com'
    const mockUser = userService.generateUser(email)
    userService.find = jest.fn().mockImplementation(() => mockUser)

    // When
    await expect(ctrl.login({
      email, password: 'invalid password'
    })).rejects.toThrowError(new UnprocessableEntityError('email or password is invalid'))

    // Then
    expect(userService.find).toHaveBeenCalledWith(email)
  })

  test('#me - return user', async () => {
    // Given
    const email = 'test@email.com'
    const mockUser = userService.generateUser(email)
    // TODO: userService.find = jest.fn().mockImplementation(() => mockUser)

    // When
    const data = await ctrl.me(mockUser)

    // Then
    // TODO: expect(userService.find).toHaveBeenCalledWith(email)
    expect(data).toHaveProperty('user')
    expect(data.user).toEqual(mockUser)
  })

  test('#update - return user w/ token', async () => {
    // Given
    const email = 'test@email.com'
    const mockUser = userService.generateUser(email)
    const updateUser = {
      username: mockUser.username + '!'
    }

    // When
    const data = await ctrl.update(mockUser, updateUser)

    // Then
    expect(data).toHaveProperty('user')
    expect(data.user.username).toEqual(updateUser.username)
    expect(data.user.token).not.toBeNull()
  })
})
