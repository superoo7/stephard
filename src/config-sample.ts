// Mongo DB setup
const MONGO_URL = 'mongodb://localhost:27017/stephard-test'

// Temp file location
const MODERATOR_LOC = '/root/moderator.json'

// Channel ID setup
const REGISTER_CHANNEL = ''
const MODERATOR_CHANNEL = ''
const POST_PROMO_CHANNEL = ''

// Trigger
const TRIGGER = '*'
const COOLDOWN_TIME = 20 * 60 * 60

export {
  MONGO_URL,
  REGISTER_CHANNEL,
  MODERATOR_CHANNEL,
  POST_PROMO_CHANNEL,
  TRIGGER,
  MODERATOR_LOC,
  COOLDOWN_TIME
}
