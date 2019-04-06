import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, ManyToMany } from 'typeorm'
import { Comment, User } from '.'

@Entity()
export class Article {

  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  slug!: string

  @Column()
  title!: string

  @Column()
  description!: string

  @Column()
  body!: string

  @Column('simple-array')
  tagList!: string[]

  @ManyToOne(_type => User, user => user.articles, {
    onDelete: 'CASCADE'
  })
  author!: User

  @OneToMany(_type => Comment, comment => comment.article)
  comments?: Comment[]

  @ManyToMany(_type => User, user => user.favoritedArticles)
  favoritedUsers?: User[]

  favorited: boolean = false
  favoritesCount: number = 0

  @Column()
  @CreateDateColumn()
  createdAt!: Date

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date
}
