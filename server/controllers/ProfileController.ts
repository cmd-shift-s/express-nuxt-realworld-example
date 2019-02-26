import { JsonController, Get, Param } from 'routing-controllers'
import debug from 'debug'
import { ProfileService } from '../services'

@JsonController('/profile')
export class ProfileController {
  private logger = debug('server:controllers:tag')

  constructor(private profileService: ProfileService) {}

  /**
   * User's Profile
   */
  @Get('/:username')
  public async profile(
    @Param('username') username: string
  ) {
    this.logger(`profile`)

    const profile = await this.profileService.profile(username)

    return { profile }
  }
}
