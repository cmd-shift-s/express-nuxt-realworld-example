import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  email!: string

  @Column()
  username!: string

  @Column()
  bio!: string

  @Column()
  image!: string

  @Column()
  password!: string

  @Column('simple-array')
  roles!: string[]

}
