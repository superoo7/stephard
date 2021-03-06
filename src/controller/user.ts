import * as mongoose from 'mongoose'
import User from '../model/user'
import { logger } from '../index'

interface userData {
  name: string
  discordid: string
  steemname: string
  lastpostdatetime: number[]
  save: any
}

const registration = async (discordName: string, discordId: string, steemName: string) => {
  let ud = await findUser(discordId)
  // @ts-ignore
  let user: userData = <userData>ud
  if (user === null) {
    let newUser = new User({
      name: discordName,
      discordid: discordId,
      steemname: steemName,
      lastpostdatetime: [0],
      user: 'probation'
    })
    let ret = await newUser.save()
    return ret
  } else {
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

// TODO: Add test
const updateUserTime = async (discordId: string, time: number) => {
  return await User.findOne({ discordid: discordId }, async (err, user: any) => {
    if (err) {
      throw err
    }
    user.lastpostdatetime = [time]
    let result = await user.save((err: any) => {
      if (err) {
        console.log(err)
        return
      }
      console.log('success')
      return
    })
    return result
  })
}

// TODO: Add test
const getAllUsers = () => {
  return User.find({})
}

export { registration, findUser, changeUserRole, updateUserTime, getAllUsers }
