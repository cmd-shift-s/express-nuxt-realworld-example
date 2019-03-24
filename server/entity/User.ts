import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm'
import { hashSync, compareSync } from 'bcryptjs'

@Entity()
@Unique([
  'email', 'username'
])
export class User {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  email!: string

  @Column()
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

  hashPassword() {
    this.password = hashSync(this.password, 8)
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return compareSync(unencryptedPassword, this.password)
  }
}
