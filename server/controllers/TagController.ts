import { JsonController, Get } from 'routing-controllers'
import debug from 'debug'

@JsonController('/tags')
export class TagController {
  private logger = debug('server:controllers:tag')

  /**
   * Popular Tags
   */
  @Get()
  public tags() {
    this.logger(`tags`)

    const tags = [
      'programming',
      'javascript',
      'emberjs',
      'angularjs',
      'react',
      'mean',
      'node',
      'rails'
    ]

    return { tags }
  }
}
