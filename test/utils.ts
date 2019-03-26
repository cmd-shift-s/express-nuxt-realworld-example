import { SuperTest, Test } from 'supertest'
import { UserLoginInfo } from '~/server/controllers'
import { User } from '~/server/entity'
import { Connection } from 'typeorm'
import faker from 'faker'

export async function getAuthentication(req: SuperTest<Test>, user: UserLoginInfo): Promise<string> {
  const res = await req.post('/api/users/login')
    .send({ user })
    .expect(200)

  expect(res.body).toHaveProperty('user')
  expect(res.body.user.token).not.toBeNull()

  return res.body.user.token
}

export type JoinedUser = Pick<User, 'id' | 'password' | 'email' | 'username'>

export async function generateJoinedUser(conn: Connection): Promise<JoinedUser> {
  if (!conn || !conn.isConnected) {
    fail('cannot connect database')
  }

  const registUserInfo = {
    id: 0,
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  }

  const user = Object.assign(new User(), registUserInfo)
  user.hashPassword()

  const { id } = await conn.getRepository(User)
    .save(user)

  registUserInfo.id = id

  return registUserInfo
}
