import { UserController } from '~/server/controllers'
import { UserService } from '~/server/services'

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
      email, password: 'asdf'
    })

    // Then
    expect(userService.find).toHaveBeenCalledWith(email)
    expect(data).toHaveProperty('user')
    expect(data.user).toHaveProperty('email')
    expect(data.user.email).toBe(email)
  })
})
