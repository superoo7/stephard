import * as Discord from 'discord.js'
import { findUser } from '../../controller/user'
import { convertSeconds } from '../template/time'
import { templateMessage, Color } from '../template'
import { TRIGGER, COOLDOWN_TIME } from '../../config'
import { UserData } from '../../module'

const last = async (msg: Discord.Message, id: string) => {
  // @ts-ignore
  const data: UserData = await findUser(id)
  if (!data) {
    templateMessage(
      msg,
      `No record of last post, it could be that you have not register. Try \`${TRIGGER}reg YOUR_STEEM_NAME\` `,
      Color.red
    )
    return
  } else if (data.lastpostdatetime[0] === 0) {
    templateMessage(msg, `You have not posted on post-promo channel`, Color.red)
    return
  } else if (data.roles === 'ban') {
    templateMessage(msg, `You are ban, please refer to moderators`, Color.red)
    return
  }

  const timeDiff = (Date.now() - data.lastpostdatetime[0]) / 1000
  const displayTime = convertSeconds(timeDiff)
  const cooldownTime =
    COOLDOWN_TIME - timeDiff > 0
      ? `❎ ${convertSeconds(COOLDOWN_TIME - timeDiff).display}`
      : `☑ available`
  msg.channel.send({
    embed: {
      title: data.name,
      color: Color.green,
      fields: [
        { name: `role`, value: data.roles },
        {
          name: 'last post: 🕐',
          value: `${displayTime.display} ago`
        },
        {
          name: 'Cooldown in: 🆒',
          value: cooldownTime
        }
      ]
    }
  })
  return
}

export default last
