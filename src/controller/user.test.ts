import { registration, findUser, changeUserRole } from './user'
import db from '../db'
import User from '../model/user'
import * as mongoose from 'mongoose'

interface UserData {
  name: string
  discordid: string
  steemname: string
  roles: string
  lastpostdatetime: number[]
}

db()

describe('user', async () => {
  // before each task
  beforeAll(async done => {
    // remove database
    await User.remove({})

    done()
  })
  // describe('another test', () => {
  it('added new user to database', async done => {
    let test = testData()
    await insertData(test)
      .then((data: any) => {
        expect(data.discordid).toBe(test.discordid)
        done()
      })
      .catch(err => {
        throw err
      })
  })

  it('finds the existing user from database based on the id', async done => {
    let test = testData()
    await insertData(test).catch(() => {
      console.log('2 1')
    })
    const findData = await findUser(test.discordid).catch(() => {
      console.log('2 2')
    })
    // @ts-ignore
    expect(findData.discordid).toBe(test.discordid)
    done()
  })

  it('changes role of a user', async done => {
    let test = testData()
    await insertData(test).catch(() => {
      console.log('3 1')
    })
    await changeUserRole(test.discordid, 'ban').catch(() => {
      console.log('3 2')
    })
    const findData = await findUser(test.discordid).catch(() => {
      console.log('3 3')
    })
    // @ts-ignore
    expect(findData.roles).toBe('ban')
    done()
  })
  // })
})

// ================================================================================
// Function
// ================================================================================

// testData: Generate random data
let testData = (): UserData => {
  let discordid = Math.floor(Math.random() * 1000).toString()
  let name = randomName(5)
  return {
    name: name,
    discordid,
    steemname: name,
    roles: 'user',
    lastpostdatetime: [0]
  }
}

// randomName: Generate random name
let randomName = (n: number): string => {
  let text: string = ''
  let possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < n; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

// ================================================================================
// DB Operation function
// ================================================================================
// 1. Insert Data
let insertData = async (data: UserData) => {
  return await registration(data.name, data.discordid, data.steemname).catch(err => {
    throw err
  })
}
