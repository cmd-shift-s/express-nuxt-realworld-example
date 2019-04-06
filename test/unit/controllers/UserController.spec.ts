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
    userService.checkIfUnencryptedPasswordIsValid = jest.fn().mockImplementation(() => true)

    const loginInfo = {
      email, password: mockUser.password
    }

    // When
    const data = await ctrl.login(loginInfo)

    // Then
    expect(userService.findByEmail).toHaveBeenCalledWith(email)
    expect(userService.checkIfUnencryptedPasswordIsValid).toHaveBeenCalledWith(mockUser.id, loginInfo.password)
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
    userService.checkIfUnencryptedPasswordIsValid = jest.fn().mockImplementation(() => false)

    // When
    await expect(ctrl.login({
      email, password: 'invalid password'
    })).rejects.toThrowError(new UnprocessableEntityError('email or password is invalid'))

    // Then
    expect(userService.findByEmail).toHaveBeenCalledWith(email)
    expect(userService.checkIfUnencryptedPasswordIsValid).toHaveBeenCalledWith(mockUser.id, 'invalid password')
  })

  test('#login - throw UnprocessableEntityError #2 not found user', async () => {
    // Given
    const email = 'not_found@email.com'
    userService.findByEmail = jest.fn().mockImplementation(() => null)
    userService.checkIfUnencryptedPasswordIsValid = jest.fn()

    // When
    await expect(ctrl.login({
      email, password: 'invalid password'
    })).rejects.toThrowError(new UnprocessableEntityError('email or password is invalid'))

    // Then
    expect(userService.findByEmail).toHaveBeenCalledWith(email)
    expect(userService.checkIfUnencryptedPasswordIsValid).not.toHaveBeenCalled()
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
    userService.findById = jest.fn().mockImplementation(() => mockUser)
    userService.update = jest.fn().mockImplementation(() => true)

    // When
    const data = await ctrl.update(mockUser, updateUser)

    Object.assign(updateUser, mockUser)

    // Then
    expect(userService.findById).toHaveBeenCalledWith(mockUser.id)
    expect(userService.update).toHaveBeenCalledWith(mockUser.id, updateUser)

    expect(data).toHaveProperty('user')
    expect(data.user.username).toEqual(updateUser.username)
    expect(data.user.token).not.toBeNull()
  })
})
