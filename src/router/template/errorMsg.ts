import * as Discord from 'discord.js'
import { templateMessage, Color } from './index'
import { SteemAccountError, SteemUpvoteError } from '../../module'

const accountErrMsg = (msg: Discord.Message, err: SteemAccountError) => {
  templateMessage(
    msg,
    `Steem error: \nName: ${err.name} (${err.code})\nMessage: ${err.message}`,
    Color.red
  )
  return
}

const upvoteErrMsg = (msg: Discord.Message, err: SteemUpvoteError) => {
  let errMsg = `Steem error: \nName: ${err.cause.name} (${err.cause.data.code})\nMessage: ${
    err.cause.data.message
  }`
  templateMessage(msg, errMsg, Color.red)
  return
}

export { accountErrMsg, upvoteErrMsg }
