import * as Discord from 'discord.js'
import { TRIGGER } from '../../config'
import { templateMessage, Color } from '../template'
import { findUser } from '../../controller/user'
import last from '../register/last'

const info = async (msg: Discord.Message, args: string[]) => {
  if (args.length !== 2) {
    templateMessage(msg, `Wrong format, try \`${TRIGGER}info @DISCORDNAME\``, Color.red)
    return
  }

  let discordId

  try {
    discordId = args[1].match(/(\<\@\!|\<\@)+(\d+)+\>/)[2]
  } catch (e) {
    templateMessage(msg, `Invalid discord user,try \`${TRIGGER}info @DISCORDNAME\``, Color.red)
    return
  }

  last(msg, discordId)
  return
}

export default info
