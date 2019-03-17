import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id?: number

  @Column({ unique: true })
  email!: string

  @Column({ unique: true })
  username!: string

  @Column({ nullable: true })
  bio?: string

  @Column({ nullable: true })
  image?: string

  @Column()
  password?: string

  @Column('simple-array', { default: ['user'] })
  roles!: string[]

}
