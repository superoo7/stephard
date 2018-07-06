import * as Discord from 'discord.js'
import { logger, client } from '../index'
import { REGISTER_CHANNEL, MODERATOR_CHANNEL, POST_PROMO_CHANNEL } from '../config'
import register from './register'
import moderator from './moderator'
import promo from './promo'

const router = (msg: Discord.Message) => {
  switch (msg.channel.id) {
    case REGISTER_CHANNEL:
      register(msg)
      break
    case MODERATOR_CHANNEL:
      moderator(msg)
      break
    case POST_PROMO_CHANNEL:
      promo(msg)
      break
    default:
      promo(msg)
      break
  }
}

export default router
