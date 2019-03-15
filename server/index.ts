import { app } from './app'
import { createConnection } from 'typeorm'

const port = process.env.API_PORT || 3000

const runServer = async () => {
  await createConnection()
  app.listen(port, () => {
    console.log(`Server listening on ${port}`)
  })
}

runServer()
  .catch(e => console.log(e))
