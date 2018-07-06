import * as Discord from 'discord.js'
import { logger, client } from '../../index'
import { steem } from '../../initialize'
import { TRIGGER, MODERATOR_LOC } from '../../config'
import { templateMessage, Color } from '../template'
import * as fs from 'fs'
import reg from './reg'
import last from './last'
import { checkMaintenance } from '../template/maintenance'

const register = async (msg: Discord.Message) => {
  // Main
  const message: string = msg.content
  const command: string = message.slice(0, 1)
  const args: string[] = message.slice(1, message.length).split(' ')
  if (command === TRIGGER) {
    let isMaintenance = await checkMaintenance(msg).catch(() => {
      return false
    })
    if (isMaintenance) {
      return
    }
    switch (args[0]) {
      case 'last':
        last(msg, msg.author.id)
        break
      case 'reg':
      case 'register':
      case 'update':
        reg(msg, args)
        break
      case 'help':
        break
      default:
        templateMessage(msg, `Invalid Command, please try \`${TRIGGER}help\` `, Color.red)
        break
    }
  }
}

export default register
