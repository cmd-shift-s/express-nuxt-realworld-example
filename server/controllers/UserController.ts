import { JsonController, CurrentUser, Get, Post, BodyParam } from 'routing-controllers'
import debug from 'debug'
import { UnprocessableEntityError } from '../common/errors'
import { UserService } from '../services'
import { User } from '~/models'
import jwt from 'jsonwebtoken'

export interface UserLoginInfo {
  email: string
  password: string
}

// export interface UserUpdateInfo {
//   username: string
// }

@JsonController()
export class UserController {
  private logger = debug('server:controllers:user')

  constructor(private userService: UserService) {}

  /**
   * Login
   */
  @Post('/users/login')
  public async login(
    @BodyParam('user') loginInfo: UserLoginInfo
  ) {
    this.logger(`login`, loginInfo)

    const user = await this.userService.find(loginInfo.email)

    if (!user || user.password !== loginInfo.password) {
      throw new UnprocessableEntityError('email or password is invalid')
    }

    delete user.password

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    const loginUser = {
      email: user.email,
      username: user.username,
      bio: user.bio,
      image: user.image,
      token,
    }

    return { user: loginUser }
  }

  /**
   * returns current user
   */
  @Get('/user')
  public async me (
    @CurrentUser({ required: true }) user: User,
  ) {
    this.logger(`user`, user)

    return { user }
  }

  /**
   * update user
   */
  // TODO:
  // @Put('/user')
  // public async updateUser (
  //   @CurrentUser({ required: true }) curUser: User,
  //   @BodyParam('user') userInfo: UserUpdateInfo
  // ) {
  //   this.logger('update', userInfo)
  //
  //   const result = await this.userService.update(curUser)
  //
  //   if (!result) {
  //     throw new NotFoundError('not found user')
  //   }
  //
  //   return { user: userInfo }
  // }
}
