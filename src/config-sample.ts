import { PostPromoRule } from './module'

// Mongo DB setup
const MONGO_URL: string = 'mongodb://localhost:27017/stephard-test'

// Temp file location
const MODERATOR_LOC: string = '/root/moderator.json'

// Channel ID setup
const REGISTER_CHANNEL: string = ''
const MODERATOR_CHANNEL: string = ''
const POST_PROMO_CHANNEL: string = ''
const PENDING_APPROVAL_CHANNEL: string = ''

// Trigger
const TRIGGER: string = '*'
const COOLDOWN_TIME: number = 20 * 60 * 60 // 20 hours

// Post Promo
const POST_CONFIG: PostPromoRule = {
  maximumPostAge: 2 * 24 * 60 * 60 * 1000, // 2 days
  minimumPostAge: 15 * 60 * 1000, // 15 minutes
  minimumLength: 120, // 120 words
  optimumLength: 4000, // 4000 words
  unwantedTags: ['nsfw'],
  requiredTags: ['teammalaysia'],
  pendingTags: ['cryptocurrency', 'steepshot']
}

const MESSAGE_LIST: string[] = [
  '#### You’ve been upvoted by **TeamMalaysia** Community :- \nTo support the growth of TeamMalaysia Follow our upvotes by using **steemauto.com** and follow trail of @myach\n\nVote **TeamMalaysia** witness bitrocker2020 using this link <a href="https://v2.steemconnect.com/sign/account-witness-vote?witness=bitrocker2020&approve=true">vote for witness</a>\n',
  '#### This post has been curated by **TeamMalaysia** Community :- \nTo support the growth of TeamMalaysia Follow our upvotes by using **steemauto.com** and follow trail of @myach\n\nVote **TeamMalaysia** witness bitrocker2020 using this link <a href="https://v2.steemconnect.com/sign/account-witness-vote?witness=bitrocker2020&approve=true">vote for witness</a>\n',
  '#### Thank you for sharing your posts with us. This post was curated by **TeamMalaysia** as part of our community support. Looking forward for more posts from you. \nTo support the growth of TeamMalaysia Follow our upvotes by using **steemauto.com** and follow trail of @myach\n\nVote **TeamMalaysia** witness bitrocker2020 using this link <a href="https://v2.steemconnect.com/sign/account-witness-vote?witness=bitrocker2020&approve=true">vote bitrocker2020 witness</a>\n',
  '#### You’ve been upvoted by **TeamMalaysia** community. Do checkout other posts made by other **TeamMalaysia** authors at http://steemit.com/created/teammalaysia\nTo support the growth of TeamMalaysia Follow our upvotes by using **steemauto.com** and follow trail of @myach\n\nVote **TeamMalaysia** witness bitrocker2020 using this link <a href="https://v2.steemconnect.com/sign/account-witness-vote?witness=bitrocker2020&approve=true">vote for witness</a>\n',
  '#### You’ve been upvoted by **TeamMalaysia** community. Here are trending posts by other **TeamMalaysia** authors at http://steemit.com/trending/teammalaysia\nTo support the growth of TeamMalaysia Follow our upvotes by using **steemauto.com** and follow trail of @myach\n\nVote **TeamMalaysia** witness bitrocker2020 using this link <a href="https://v2.steemconnect.com/sign/account-witness-vote?witness=bitrocker2020&approve=true">vote for witness</a>\n'
]

export {
  MONGO_URL,
  REGISTER_CHANNEL,
  MODERATOR_CHANNEL,
  POST_PROMO_CHANNEL,
  PENDING_APPROVAL_CHANNEL,
  TRIGGER,
  MODERATOR_LOC,
  COOLDOWN_TIME,
  POST_CONFIG,
  MESSAGE_LIST
}
