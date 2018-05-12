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
  let user = await findUser(discordId)
  if (user === null) {
    let newUser = new User({
      name: discordName,
      discordid: discordId,
      steemname: steemName,
      lastpostdatetime: [0],
      user: 'user'
    })
    let ret = await newUser.save()
    return ret
  } else {
    // @ts-ignore
    user.steemname = steemName
    return await user.save()
  }
}

const findUser = async (discordId: string) => {
  return await User.findOne({ discordid: discordId }, (err: any, user: any) => user)
}

const changeUserRole = async (discordId: string, roles: string) => {
  return await User.findOne({ discordid: discordId }, async (error, user: any) => {
    if (error) throw 'User not found'
    user.roles = roles.toLowerCase()
    // console.log(user)
    // if (roles.toLowerCase() === 'user') {
    //   user.lastpostdatetime = [user.lastpostdatetime[0]]
    // } else if (roles.toLowerCase() === 'sponsor') {
    //   user.lastpostdatetime = [0, user.lastpostdatetime[0]]
    // }
    return await user.save()
  })
}

export { registration, findUser, changeUserRole }
