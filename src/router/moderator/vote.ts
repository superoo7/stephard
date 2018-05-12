import * as Discord from 'discord.js'
import { templateMessage, Color } from '../template'
import { TRIGGER } from '../../config'
import { upvote, comment } from '../template/steem'
import { steem } from '../../initialize'

const vote = async (msg: Discord.Message, args: string[]) => {
  if (args.length !== 3) {
    templateMessage(msg, `Wrong format, try \`${TRIGGER}roles @DISCORDNAME user\``, Color.red)
    return
  } else {
    let author = args[1].split(/[\/#]/)[4].substr(1)
    let permlink = args[1].split(/[\/#]/)[5]
    let weightage = parseInt(args[2])

    await Promise.all([
      upvote(
        process.env.STEEM_USERNAME,
        process.env.STEEM_POSTING,
        author,
        permlink,
        weightage,
        steem
      ),
      comment(
        process.env.STEEM_USERNAME,
        process.env.STEEM_POSTING,
        author,
        permlink,
        msg.author.username,
        steem
      )
    ])
      .then(() => {
        templateMessage(msg, `Success`, Color.green)
      })
      .catch(() => {
        templateMessage(msg, 'Failed, try again later', Color.red)
      })
  }
}

export default vote
