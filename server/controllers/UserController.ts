import { JsonController, CurrentUser, Get, Post, BodyParam, Put, NotFoundError } from 'routing-controllers'
import debug from 'debug'
import { UnprocessableEntityError } from '../common/errors'
import { UserService, UserRegistInfo, UserUpdateInfo } from '../services'
import { User } from '../entity'
import jwt from 'jsonwebtoken'

import { hashSync } from 'bcryptjs'

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
    @BodyParam('user', { required: true }) loginInfo: UserLoginInfo
  ) {
    this.logger(`login`, loginInfo)

    const user = await this.userService.findByEmail(loginInfo.email)

    if (!user || !user.checkIfUnencryptedPasswordIsValid(loginInfo.password)) {
      throw new UnprocessableEntityError('email or password is invalid')
    }

    delete user.password
    delete user.updatedAt

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
    @BodyParam('user', { required: true }) registInfo: UserRegistInfo
  ) {
    const errors: string[] = []
    const { email, username, password } = registInfo

    if (!username) {
      errors.push('Name is required')
    } else if (await this.userService.findByUsername(username)) {
      errors.push('That username is already used')
    }

    if (!email) {
      errors.push('Email is required')
    } else if (await this.userService.findByEmail(email)) {
      errors.push('That email is already taken')
    }

    if (!password) {
      errors.push('password is required')
    } else if (password.length < 8) {
      errors.push('password is too short (minimum is 8 characters)')
    }

    if (errors.length > 0) {
      throw new UnprocessableEntityError(errors)
    }

    let user = new User()
    user.email = email
    user.username = username
    user.password = password

    user.hashPassword()

    try {
      user = await this.userService.save(user)
    } catch (e) {
      throw new UnprocessableEntityError('Failed to save')
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

    const errors: string[] = []

    if (userInfo.password && userInfo.password.length < 8) {
      errors.push('password is too short (minimum is 8 characters)')
    }

    if (errors.length > 0) {
      throw new UnprocessableEntityError(errors)
    }

    const user = await this.userService.findById(curUser.id)

    if (!user) {
      throw new NotFoundError('not found user')
    }

    if (userInfo.password) {
      userInfo.password = hashSync(userInfo.password, 8)
    }

    try {
      const result = await this.userService.update(user.id, userInfo)

      if (!result) {
        throw new NotFoundError('not found user')
      }

      const updatedUser = await this.userService.findById(curUser.id)
      if (!updatedUser) {
        throw new NotFoundError(`not found user`)
      }

      delete updatedUser.password

      const token = this.getSignToken(updatedUser, {
        expiresIn: '1d'
      })

      const loggedUser = {
        ...updatedUser,
        token,
      }

      return { user: loggedUser }
    } catch (e) {
      throw new UnprocessableEntityError('failed to update')
    }
  }
}
