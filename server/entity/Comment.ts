import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne } from 'typeorm'
import { Article, User } from '.'

@Entity()
export class Comment {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  body!: string

  @OneToOne(_type => User)
  author!: User

  @ManyToOne(_type => Article, article => article.comments)
  article!: Article

  @Column()
  @CreateDateColumn()
  createdAt!: Date

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date
}
