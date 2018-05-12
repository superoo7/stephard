import * as Discord from 'discord.js'
import * as fs from 'fs'
import { MODERATOR_LOC } from '../../config'
import { templateMessage, Color } from '../template'

const maintenance = async (msg: Discord.Message, args: string[]) => {
  if (args[1].toLowerCase() === 'on') {
    await updateFile(true)
      .then(() => {
        templateMessage(msg, `Maintenance: ON`, Color.green)
      })
      .catch(() => {
        templateMessage(msg, `Unable to update status`, Color.red)
      })
  } else if (args[1].toLocaleLowerCase() === 'off') {
    await updateFile(false)
      .then(() => {
        templateMessage(msg, `Maintenance: OFF`, Color.green)
      })
      .catch(() => {
        templateMessage(msg, `Unable to update status`, Color.red)
      })
  }
  return
}

const updateFile = async (maintenance: boolean) => {
  return await fs.writeFile(MODERATOR_LOC, JSON.stringify({ maintenance: maintenance }), err => {
    if (err) throw err
  })
}

export default maintenance
