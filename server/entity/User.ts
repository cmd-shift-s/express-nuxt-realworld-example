import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  username!: string

  @Column()
  bio!: string

  @Column()
  image!: number

  @Column()
  passsword!: number

  @Column('simple-array')
  roles!: string[]

}
