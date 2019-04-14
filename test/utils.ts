import { SuperTest, Test } from 'supertest'
import { UserLoginInfo } from '~/server/controllers'
import { User } from '~/server/entity'
import { getConnection } from 'typeorm'
import faker from 'faker'
import { hash } from 'bcryptjs'

export async function getAuthentication(req: SuperTest<Test>, user: UserLoginInfo): Promise<string> {
  const res = await req.post('/api/users/login')
    .send({ user })
    .expect(200)

  expect(res.body).toHaveProperty('user')
  expect(res.body.user.token).not.toBeNull()

  return res.body.user.token
}

export function persists<T>(entity: (new () => {}), data: T): Promise<T> {
  const conn = getConnection()
  return conn.getRepository(entity).save(data)
}

export type JoinedUser = Pick<User, 'id' | 'password' | 'email' | 'username'>

export async function generateJoinedUser(): Promise<JoinedUser> {

  const conn = getConnection()

  const password = faker.internet.password()

  const registUserInfo = {
    id: 0,
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: await hash(password, 8),
  }

  const { id } = await conn.getRepository(User)
    .save(registUserInfo)

  registUserInfo.id = id
  registUserInfo.password = password

  return registUserInfo
}
