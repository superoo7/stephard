import * as Discord from 'discord.js'
import { TRIGGER } from '../../config'
import maintenance from './maintenance'
import info from './info'
import roles from './roles'
import vote from './vote'
import { templateMessage, Color } from '../template'

const moderator = (msg: Discord.Message) => {
  // Main
  const message: string = msg.content
  const command: string = message.slice(0, 1)
  const args: string[] = message.slice(1, message.length).split(' ')
  if (command === TRIGGER) {
    switch (args[0]) {
      case 'maintenance':
        maintenance(msg, args)
        break
      case 'info':
        info(msg, args)
        break
      case 'roles':
        roles(msg, args)
        break
      case 'upvote':
      case 'vote':
        vote(msg, args)
        break
      default:
        templateMessage(msg, `Type \`${TRIGGER}help\` to get started`, Color.red)
        break
    }
  }
}

export default moderator
