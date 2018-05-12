import * as Discord from 'discord.js'

import { steem } from '../../index'
import { templateMessage, Color } from '../template'
import { registration } from '../../controller/user'

const reg = async (msg: Discord.Message, args: string[]) => {
  if (args.length === 2 && args[1].match(/^[a-z][a-z0-9\-\.]+$/)) {
    let data = await steem.api.getAccountsAsync([args[1]])
    if (data.length !== 0) {
      const data: any = await registration(msg.author.username, msg.author.id, args[1])
      templateMessage(
        msg,
        `<@!${msg.author.id}> Successfully registered @${data.steemname}`,
        Color.green
      )
    } else {
      templateMessage(msg, `Invalid Steem Username. (or maybe steem is down)`, Color.red)
    }
  } else {
    const errorMessage =
      'Either invalid input or your steem username format is wrong\n\nit should start with letters, only can contain lowercase letters, numbers, . and -'
    templateMessage(msg, errorMessage, Color.red)
  }
}

export default reg
