import * as express from 'express'
import * as bodyParser from 'body-parser'
import { getAllUsers } from './controller/user'
import { UserData } from './module'
const cors: Function = require('cors')

const HTTP_PORT: number = parseInt(<string>process.env.HTTP_PORT) || 3001

// Setup Express REST SERVER
const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/data.json', async (req, res) => {
  const data = await getAllUsers()
  res.json(data)
})

app.get('/data.csv', async (req, res) => {
  let csvData = `Steem Name, Discord Name, Role\n`
  // @ts-ignore
  const data: UserData[] = <UserData[]>await getAllUsers()
  data.forEach(d => {
    csvData += `${d.steemname}, ${d.name}, ${d.roles}\n`
  })
  res.statusCode = 200
  res.header('Content-Disposition', 'attachment;filename=data.csv')

  res.type('text/csv')
  res.send(csvData)
})
app.listen(HTTP_PORT, () => {
  console.log(`Listening on port ${HTTP_PORT}`)
})
