import * as mongoose from 'mongoose'
import User from '../model/user'
import { logger } from '../index'

interface userData {
  name: string
  discordid: string
  steemname: string
  lastpostdatetime: number[]
}

const registration = async (discordName: string, discordId: string, steemName: string) => {
  let user = new User({
    name: discordName,
    discordid: discordId,
    steemname: steemName,
    lastpostdatetime: [0],
    user: 'user'
  })
  const data = await User.findOneAndUpdate(
    { discordid: discordId },
    user,
    { upsert: true },
    (err, user) => {
      if (err) {
        console.log('err')
        console.log(err)
        throw err
      }
      return user
    }
  )

  return data
}

const findUser = async (discordId: string) => {
  return await User.findOne({ discordid: discordId }, (err, user) => {
    if (err) {
      throw err
    }
    return user
  })
}

const changeUserRole = async (discordId: string, roles: string) => {
  return await User.findOne({ discordid: discordId }, async (err, user: any) => {
    if (err) throw err
    user.roles = roles.toLowerCase()
    if (roles.toLowerCase() === 'user') {
      user.lastpostdatetime = [user.lastpostdatetime[0]]
    } else if (roles.toLowerCase() === 'sponsor') {
      user.lastpostdatetime = [0, user.lastpostdatetime[0]]
    }
    return await user.save()
  })
}

export { registration, findUser, changeUserRole }
