import * as Discord from 'discord.js'
import { client } from '../../index'
import { PENDING_APPROVAL_CHANNEL } from 'config'
import { updateUserTime } from 'controller/user'

enum Color {
  green = 0x00f900,
  red = 0xff0000
}

const templateMessage = async (msg: Discord.Message, content: string, color: Color) => {
  await msg.channel.send({
    embed: {
      color: color,
      description: content
    }
  })
  return
}

const deleteMessage = async (msg: Discord.Message, reason: string) => {
  await msg.delete()
  await msg.author.send({
    embed: {
      color: Color.red,
      description: `This is an automatic message being send by the stephard bot, because one of your post was deleted from teammalaysia post-promo channel. Your archived message will be at the last message send.`
    }
  })
  await msg.author.send({
    embed: {
      color: Color.red,
      description: `Reason: ${reason}`
    }
  })
  await msg.author.sendMessage(msg.content)
  return
}

const pendingMessage = async (
  msg: Discord.Message,
  reason: string,
  url: string,
  weightage: number = 10
) => {
  await msg.delete()
  await templateMessage(
    msg,
    `Your post has been forwarded to #pending-for-approval, please wait for moderator to review`,
    Color.red
  )
  await updateUserTime(msg.author.id, msg.createdTimestamp).catch(() =>
    templateMessage(msg, `Database error`, Color.red)
  )
  const fields = [
    {
      name: 'Author',
      value: `${msg.author.username} (<@${msg.author.id}>)`
    },
    {
      name: 'Steemit Link',
      value: url
    },
    {
      name: 'Suggested Weightage',
      value: weightage
    },
    {
      name: 'Content',
      value: msg.content
    }
  ]

  // @ts-ignore
  await client.channels.get(PENDING_APPROVAL_CHANNEL).send({
    embed: {
      color: Color.green,
      description: `Reason: **${reason}**`,
      fields
    }
  })
}

export { templateMessage, deleteMessage, pendingMessage, Color }
