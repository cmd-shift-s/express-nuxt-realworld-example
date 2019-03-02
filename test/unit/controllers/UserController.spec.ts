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

  test('should return user', async () => {
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
  })

  test('should throw UnprocessableEntityError #1 not found email', () => {
    // Given
    const email = 'test@email.com'
    const mockUser = userService.generateUser(email)
    userService.find = jest.fn().mockImplementation(() => mockUser)

    // When
    expect(ctrl.login({
      email, password: 'invalid password'
    })).rejects.toThrowError(new UnprocessableEntityError('email or password is invalid'))

    // Then
    expect(userService.find).toHaveBeenCalledWith(email)
  })

  test('should throw UnprocessableEntityError #2 invalid passwod', () => {
    // Given
    const email = 'test@email.com'
    const mockUser = userService.generateUser(email)
    userService.find = jest.fn().mockImplementation(() => mockUser)

    // When
    expect(ctrl.login({
      email, password: 'invalid password'
    })).rejects.toThrowError(new UnprocessableEntityError('email or password is invalid'))

    // Then
    expect(userService.find).toHaveBeenCalledWith(email)
  })
})
