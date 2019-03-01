import { JsonController, Post, BodyParam } from 'routing-controllers'
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

    if (user.password !== loginInfo.password) {
      // throw error
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
