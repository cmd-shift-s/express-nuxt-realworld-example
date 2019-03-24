import { JsonController, Get, Param, NotFoundError, CurrentUser, Post, Delete, InternalServerError } from 'routing-controllers'
import debug from 'debug'
import { UserService } from '../services'
import { User } from '../entity'

@JsonController('/profiles')
export class ProfileController {
  private logger = debug('server:controllers:tag')

  constructor(
    private userService: UserService
  ) {}

  /**
   * User's Profile
   */
  @Get('/:username')
  public async profile(
    @Param('username') username: string,
    @CurrentUser() curUser?: User,
  ) {
    this.logger(`profile`, username)

    const user = await this.userService.findByUsername(username)

    if (!user) {
      throw new NotFoundError('user not found')
    }

    let following = false

    if (curUser && curUser.username !== username) {
      following = await this.userService.isFollowing(user.id, curUser.id)
    }

    const profile = {
      username,
      bio: user.bio,
      image: user.image,
      following
    }

    return { profile }
  }

  @Post('/:username/follow')
  public async follow(
    @Param('username') username: string,
    @CurrentUser({ required: true }) curUser: User,
  ) {
    this.logger(`follow`, username)

    const user = await this.userService.findByUsername(username)

    if (!user) {
      throw new NotFoundError('user not found')
    }

    try {
      await this.userService.follow(user.id, curUser.id)
    } catch (e) {
      throw new InternalServerError('failed to insert')
    }

    const profile = {
      username,
      bio: user.bio,
      image: user.image,
      following: true
    }

    return { profile }
  }

  @Delete('/:username/follow')
  public async unfollow(
    @Param('username') username: string,
    @CurrentUser({ required: true }) curUser: User,
  ) {
    this.logger(`unfollow`, username)

    const user = await this.userService.findByUsername(username)

    if (!user) {
      throw new NotFoundError('user not found')
    }

    try {
      await this.userService.unfollow(user.id, curUser.id)
    } catch (e) {
      throw new InternalServerError('failed to delete')
    }

    const profile = {
      username,
      bio: user.bio,
      image: user.image,
      following: false
    }

    return { profile }
  }

}
