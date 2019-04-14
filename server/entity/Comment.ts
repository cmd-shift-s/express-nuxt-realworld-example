import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { Article, User } from '.'

export type CommentForm = Pick<Comment, 'body'>

@Entity()
export class Comment {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  body!: string

  @ManyToOne(_type => User, user => user.comments, {
    onDelete: 'CASCADE'
  })
  author!: User

  @ManyToOne(_type => Article, article => article.comments, {
    onDelete: 'CASCADE'
  })
  article!: Article

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
