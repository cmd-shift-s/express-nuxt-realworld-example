import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm'
import { hashSync, compareSync } from 'bcryptjs'
import { Article } from '.'

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  email!: string

  @Column({ unique: true })
  username!: string

  @Column({ nullable: true })
  bio?: string

  @Column({ nullable: true })
  image?: string

  @Column()
  password!: string

  @Column()
  @CreateDateColumn()
  createdAt!: Date

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date

  @Column('simple-array', { default: 'user' })
  roles!: string[]

  /** 나를 팔로워한 사용자들 */
  @ManyToMany(_type => User)
  @JoinTable()
  followers?: User[]

  /**
   * 팔로워 수
   */
  followerCount: number = 0

  /**
   * 팔로워 여부
   */
  following: boolean = false

  @OneToMany(_type => Article, article => article.author)
  /**
   * 작성한 articles
   */
  articles?: Article[]

  @ManyToMany(_type => Article, article => article.favoritedUsers)
  @JoinTable()
  /**
   * 좋아요한 articles
   */
  favoritedArticles?: Article[]

  hashPassword() {
    this.password = hashSync(this.password, 8)
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return compareSync(unencryptedPassword, this.password)
  }
}
