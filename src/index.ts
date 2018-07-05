// Library Import
import * as Discord from 'discord.js'
import * as logger from 'winston'
import * as dotenv from 'dotenv'

// Local Import
import db from './db'
import router from './router'

// Initialize
// dotenv
dotenv.config()
// db
db().catch(err => {
  logger.error(`Database initialize fail`)
})
// discord
const client = new Discord.Client()

// ================================================================================
// Discord Client log in
// ================================================================================
client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`)
})

// on message receive
client.on('message', msg => {
  if (msg.author.id !== client.user.id) router(msg)
})

// Discord Login
client.login(process.env.DISCORD_TOKEN)

// Export
export { logger, client }
