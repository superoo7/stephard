import * as Discord from 'discord.js'
import * as fs from 'fs'
import { MODERATOR_LOC } from '../../config'
import { templateMessage, Color } from '.'

const checkMaintenance = async (msg: Discord.Message) => {
  // Check Maintenance
  let maintenance: string = await fs.readFileSync(MODERATOR_LOC, 'utf-8')
  if (JSON.parse(maintenance).maintenance) {
    templateMessage(msg, `Bot under maintenance`, Color.red)
    return true
  }
  return false
}

export { checkMaintenance }
