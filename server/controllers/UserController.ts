import { JsonController, Post, BodyParam } from 'routing-controllers'
import { UnprocessableEntityError } from '../common/errors'
import debug from 'debug'
import { UserService } from '../services'

interface UserLoginInfo {
  email: string
  password: string
}

@JsonController('/users')
export class UserController {
  private logger = debug('server:controllers:user')

  constructor(private userService: UserService) {}

  /**
   * Login
   */
  @Post('/login')
  public async login(
    @BodyParam('user') loginInfo: UserLoginInfo
  ) {
    this.logger(`login`, loginInfo)

    const user = await this.userService.find(loginInfo.email)

    if (!user || user.password !== loginInfo.password) {
      throw new UnprocessableEntityError('email or password is invalid')
    }

    const loginUser = {
      email: user.email,
      token: 'jwt.token',
      username: user.username,
      bio: user.bio,
      image: user.image,
    }

    return { user: loginUser }
  }
}
