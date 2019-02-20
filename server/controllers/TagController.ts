import { JsonController, Get } from 'routing-controllers'
import debug from 'debug'
import { TagService } from '../services';

@JsonController('/tags')
export class TagController {
  private logger = debug('server:controllers:tag')

  constructor(private tagService: TagService) {}

  /**
   * Popular Tags
   */
  @Get()
  public async tags() {
    this.logger(`tags`)

    const tags = await this.tagService.list();

    return { tags }
  }
}
