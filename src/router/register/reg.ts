import * as Discord from 'discord.js'

import { steem } from '../../initialize'
import { templateMessage, Color } from '../template'
import { registration } from '../../controller/user'
import { accountErrMsg } from '../template/errorMsg'
import { SteemAccountError } from '../../module'

const reg = async (msg: Discord.Message, args: string[]) => {
  if (args.length === 2 && args[1].match(/^[a-z][a-z0-9\-\.]+$/)) {
    const getAccount: any = (d: string[]) =>
      new Promise((resolve, reject) => {
        steem.api.getAccounts(d, (err: { name: string; message: string }, res: any[]) => {
          if (err) {
            reject(err)
          }
          resolve(res)
        })
      })
    let data = await getAccount([args[1]]).catch((err: SteemAccountError) => {
      accountErrMsg(msg, err)
      return
    })
    if (data.length !== 0) {
      const data: any = await registration(msg.author.username, msg.author.id, args[1]).catch(
        () => {
          console.error('err')
        }
      )
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
