import * as mongoose from 'mongoose'
import { MONGO_URL } from './config'

const db = () => {
  let db = mongoose.connect(MONGO_URL)
  return db
}

export default db
