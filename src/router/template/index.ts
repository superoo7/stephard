import * as Discord from 'discord.js'

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

export { templateMessage, Color }
