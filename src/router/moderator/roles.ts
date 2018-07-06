import * as Discord from 'discord.js'
import { templateMessage, Color } from '../template'
import { TRIGGER } from '../../config'
import { changeUserRole } from '../../controller/user'

const roles = async (msg: Discord.Message, args: string[]) => {
  if (args.length !== 3) {
    templateMessage(msg, `Wrong format, try \`${TRIGGER}roles @DISCORDNAME user\``, Color.red)
    return
  } else if (!['user', 'ban', 'probation', 'senior'].includes(args[2].toLowerCase())) {
    templateMessage(msg, `Invalid role (user/ban/probation/senior)`, Color.red)
    return
  }
  let discordId, role
  try {
    discordId = args[1].match(/(\<\@\!|\<\@)+(\d+)+\>/)[2]
    role = args[2]
  } catch (e) {
    templateMessage(
      msg,
      `Invalid discord user, try \`${TRIGGER}roles @DISCORDNAME user\``,
      Color.red
    )
    return
  }
  const res: any = await changeUserRole(discordId, role)
  if (!res) {
    templateMessage(msg, `Unable to update`, Color.red)
    return
  }
  templateMessage(msg, `Updated role to ${role}`, Color.green)
}

export default roles
