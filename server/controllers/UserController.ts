import { JsonController, CurrentUser, Get, Post, BodyParam, Put, NotFoundError } from 'routing-controllers'
import debug from 'debug'
import { UnprocessableEntityError } from '../common/errors'
import { UserService, UserRegistInfo, UserUpdateInfo } from '../services'
import { User } from '../entity'
import jwt from 'jsonwebtoken'

export interface UserLoginInfo {
  email: string
  password: string
}

@JsonController()
export class UserController {
  private logger = debug('server:controllers:user')

  constructor(private userService: UserService) {}

  private getSignToken(user: User, options?: jwt.SignOptions) {
    return jwt.sign({ user }, process.env.JWT_SECRET, options)
  }

  /**
   * Login
   */
  @Post('/users/login')
  public async login(
    @BodyParam('user') loginInfo: UserLoginInfo
  ) {
    this.logger(`login`, loginInfo)

    const user = await this.userService.findByEmail(loginInfo.email)

    if (!user || user.password !== loginInfo.password) {
      throw new UnprocessableEntityError('email or password is invalid')
    }

    delete user.password

    const token = this.getSignToken(user, {
      expiresIn: '1d'
    })

    const loggedUser = {
      ...user,
      token,
    }

    return { user: loggedUser }
  }

  /**
   * Regist
   */
  @Post('/users')
  public async regist(
    @BodyParam('user') registInfo: UserRegistInfo
  ) {
    const user = await this.userService.save(registInfo)

    if (!user) {
      // throw FailedInsertDatabaseException
    }

    return { user }
  }

  /**
   * returns current user
   */
  @Get('/user')
  public async me (
    @CurrentUser({ required: true }) curUser: User,
  ) {
    this.logger(`me`, curUser)

    const user = await this.userService.findByEmail(curUser.email)

    return { user }
  }

  /**
   * update user
   */
  @Put('/user')
  public async update (
    @CurrentUser({ required: true }) curUser: User,
    @BodyParam('user') userInfo: UserUpdateInfo
  ) {
    this.logger('update', userInfo)

    const result = await this.userService.update(curUser.id, userInfo)

    if (!result) {
      throw new NotFoundError('not found user')
    }

    const user = Object.assign({}, curUser, userInfo)

    const token = this.getSignToken(user, {
      expiresIn: '1d'
    })

    const loggedUser = {
      ...user,
      token,
    }

    return { user: loggedUser }
  }
}
