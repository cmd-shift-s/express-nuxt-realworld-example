import { Author } from './Author'

export interface Article {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: Author
}

export type ArticleFormData = Pick<Article, 'title' | 'description' | 'body' | 'tagList'>
export type ArticleSearchParams = {
  tag?: string,
  author?: string,
  favorited?: string,
  limit?: string,
  offset?: string
}
