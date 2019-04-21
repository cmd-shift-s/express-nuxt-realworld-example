import { Not, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Article } from '../entity'

export class TagService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>
  ) {}

  async list(limit: number = 20): Promise<string[]> {
    const articles = await this.articleRepository.find({
      where: {
        tagList: Not('')
      }
    })

    const tags: { [key: string]: number } = {}
    // const tags = new Set<string>()
    articles.forEach(article => {
      article.tagList.forEach(tag => {
        if (tags.hasOwnProperty(tag)) {
          tags[tag]++
        } else {
          tags[tag] = 1
        }
      })
    })

    return Object.entries(tags)
      .sort((tag1, tag2) => tag2[1] - tag1[1])
      .slice(0, limit)
      .map(tag => tag[0])
  }
}
