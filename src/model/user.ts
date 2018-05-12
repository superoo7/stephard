import * as mongoose from 'mongoose'

let Schema = mongoose.Schema

let userSchema = new Schema({
  name: { type: String, required: true },
  discordid: { type: String, required: true },
  steemname: { type: String, required: true },
  roles: {
    type: String,
    default: 'user',
    required: true,
    enum: ['user', 'ban', 'special', 'sponsor']
  },
  lastpostdatetime: {
    type: [Number],
    required: true
  }
})

let userModel = mongoose.model('User', userSchema)

export default userModel
