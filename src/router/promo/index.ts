import * as Discord from 'discord.js'
import { checkMaintenance } from '../template/maintenance'
import { templateMessage, Color, deleteMessage, pendingMessage } from '../template'
import { TRIGGER, COOLDOWN_TIME, POST_CONFIG, BONUS_WEIGHTAGE } from '../../config'
import { findUser, updateUserTime } from '../../controller/user'
import { convertSeconds } from '../template/time'
import { findPost, upvote, comment } from '../template/steem'
import { SteemPostInfo, UserData, SteemUpvoteError } from '../../module'
import { steem } from '../../initialize'
import { upvoteErrMsg } from '../template/errorMsg'

const promo = async (msg: Discord.Message) => {
  // check maintenance
  let isMaintenance = await checkMaintenance(msg).catch(() => {
    return false
  })
  if (isMaintenance) {
    const replyMsg = `Stephard is under maintenance.`
    await templateMessage(msg, replyMsg, Color.red)
    await deleteMessage(msg, replyMsg)
    return
  }

  // Initialize variable
  const post = msg.content
  let authorName: string, permlinkName: string, weightage: number

  // Get data from database
  const tempData = await findUser(msg.author.id)
  // @ts-ignore
  const data: UserData = tempData
  // ============================================================
  // REJECT: If not yet registered
  // ============================================================
  if (!data) {
    await templateMessage(
      msg,
      `[<@${
        msg.author.id
      }>] No record of last post, it could be that you have not register. Try \`${TRIGGER}reg YOUR_STEEM_NAME\` at  #register-before-post-promo.`,
      Color.red
    )
    await deleteMessage(msg, `Please go to #register-before-post-promo to register yourself.`)
    return
  }
  // ============================================================
  // REJECT: If user role is ban
  // ============================================================
  if (data.roles === 'ban') {
    const replyMsg = `[<@${msg.author.id}>] You are ban, please refer to moderators`
    await templateMessage(msg, replyMsg, Color.red)
    await deleteMessage(msg, `${replyMsg} of TeamMalaysia`)
    return
  }
  // ============================================================
  // LOGGER: Welcome msg for first time posting
  // ============================================================
  if (data.lastpostdatetime.length === 1 && data.lastpostdatetime[0] === 0) {
    templateMessage(
      msg,
      `[<@${
        msg.author.id
      }>] Seems like it is the first time you posting here, Please read the guideline on #announcement and Welcome!`,
      Color.green
    )
  }

  // ============================================================
  // REJECT: Contains Steemit link?
  // ============================================================
  let isPostValid: boolean = !!post.match(/(http|https):\/\/(www\.steemit\.com\/|steemit\.com\/)/g)
  if (!isPostValid) {
    const replyMsg = `Please attach steemit.com link only`
    await templateMessage(msg, `[<@${msg.author.id}>]: ${replyMsg}`, Color.red)
    await deleteMessage(msg, replyMsg)
    return
  }
  // ============================================================
  // REJECT: Minimum Words being shared on discord < 10
  // ============================================================
  const messageWordsCount: number = post.match(/[\u00ff-\uffff]|\S+/g).length
  if (messageWordsCount < 10) {
    const replyMsg = `Please write a short description before posting the link/URL. (10-50 words).   请在发布链接或URL之前写一个简短的描述。`
    await templateMessage(msg, `[<@${msg.author.id}>]: ${replyMsg}`, Color.red)
    await deleteMessage(msg, replyMsg)
    return
  }
  // ============================================================
  // REJECT: lastpostdatetime < COOLDOWN_TIME
  // ============================================================
  const timeDiff = (Date.now() - data.lastpostdatetime[0]) / 1000
  if (COOLDOWN_TIME - timeDiff > 0) {
    const replyMsg = `Please wait ${
      convertSeconds(COOLDOWN_TIME - timeDiff).display
    } before sharing the post`
    await templateMessage(msg, `[<@${msg.author.id}>]: ${replyMsg}`, Color.red)
    await deleteMessage(msg, replyMsg)
    return
  }

  // extract permlink
  let link = post.match(/(https?:\/\/[^\s]+)/g)
  if (link.length === 1) {
    authorName = link[0].split(/[\/#]/)[4]
    permlinkName = link[0].split(/[\/#]/)[5]
    // parse out author and permlink and check wether is correct
    if (!(authorName.charAt(0) === '@' && !!permlinkName)) {
      // Find post on steemit
      const replyMsg = 'Invalid Link'
      await templateMessage(msg, `[<@${msg.author.id}>]: ${replyMsg}`, Color.red)
      await deleteMessage(msg, replyMsg)
      return
    }
  } else {
    const replyMsg = 'Invalid Link'
    await templateMessage(msg, `[<@${msg.author.id}>]: ${replyMsg}`, Color.red)
    await deleteMessage(msg, replyMsg)
    return
  }

  const postData = await findPost(authorName.substring(1), permlinkName).catch((err: any) => {
    if (err.err === 'CHEETAH') {
      // pending post
      pendingMessage(msg, 'Post voted by cheetah', link[0])
      return { err: err.err }
    } else if (err.err === 'VOTED') {
      const replyMsg = 'Post already been voted'
      templateMessage(msg, `[<@${msg.author.id}>]: ${replyMsg}`, Color.red)
      deleteMessage(msg, replyMsg)
      return { err: err.err }
    } else {
      const replyMsg = JSON.stringify(err)
      templateMessage(msg, `[<@${msg.author.id}>]: ${replyMsg}`, Color.red)
      deleteMessage(msg, replyMsg)
      return { err: err }
    }
  })

  // If err
  if (postData.hasOwnProperty('err')) {
    return
  }

  // Change type
  const d: SteemPostInfo = <SteemPostInfo>postData
  // ============================================================
  // REJECT: POST LENGTH
  // GET weightage
  // ============================================================
  if (d.bodyLength < POST_CONFIG.minimumLength) {
    const replyMsg = `Post is too short (Your post length: ${d.bodyLength}words). Minimum length: ${
      POST_CONFIG.minimumLength
    }words`
    await templateMessage(msg, `[<@${msg.author.id}>]: ${replyMsg}`, Color.red)
    await deleteMessage(msg, replyMsg)
    return
  } else if (d.bodyLength > POST_CONFIG.optimumLength) {
    weightage = 50
  } else {
    // 10% ~ 50% VP
    weightage = Math.floor((d.bodyLength / POST_CONFIG.optimumLength) * 40 + 10)
  }
  // ============================================================
  // REJECT: unwantedTags
  // ============================================================
  const isUnwantedTagExist: boolean =
    d.tags.filter((tag: string) => {
      return POST_CONFIG.unwantedTags.includes(tag)
    }).length !== 0
  if (isUnwantedTagExist) {
    const replyMsg = `This bot does not support following tags: ${POST_CONFIG.unwantedTags.join(
      ','
    )}`
    await templateMessage(msg, replyMsg, Color.red)
    await deleteMessage(msg, replyMsg)
    return
  }
  // ============================================================
  // REJECT: requiredTags
  // ============================================================
  const isRequiredTagNotExist = !(
    d.tags.filter((tag: string) => {
      return POST_CONFIG.requiredTags.includes(tag)
    }).length === POST_CONFIG.requiredTags.length
  )
  if (isRequiredTagNotExist) {
    const replyMsg = `To use this bot, you required to use the following tags: ${POST_CONFIG.requiredTags.join(
      ','
    )}`
    await templateMessage(msg, `[<@${msg.author.id}>]: ${replyMsg}`, Color.red)
    await deleteMessage(msg, replyMsg)
    return
  }
  // ============================================================
  // PENDING: pendingTags
  // ============================================================
  const isPendingTagsExist = !(
    d.tags.filter(tag => {
      if (POST_CONFIG.pendingTags.includes(tag)) {
        return true
      }
      return false
    }).length === 0
  )
  if (isPendingTagsExist) {
    const replyMsg = 'Use of pending tags'
    await templateMessage(msg, `[<@${msg.author.id}>]: ${replyMsg}`, Color.red)
    await deleteMessage(msg, replyMsg)
    return
  }
  // ============================================================
  // REJECT: POST AGE
  // ============================================================
  const unixDate: number = new Date(
    d.created
      .replace(/-/g, '/')
      .replace('T', ' ')
      .replace('Z', '')
  ).getTime()
  const postAge = Date.now() - unixDate
  if (postAge > POST_CONFIG.maximumPostAge) {
    const replyMsg = 'Post too old to be shared (more than 3.5 days)'
    await templateMessage(msg, `[<@${msg.author.id}>]: ${replyMsg}`, Color.red)
    await deleteMessage(msg, replyMsg)
    return
  } else if (postAge < POST_CONFIG.minimumPostAge) {
    const replyMsg = 'Post too new to be shared (less than 30 minutes)'
    await templateMessage(msg, `[<@${msg.author.id}>]: ${replyMsg}`, Color.red)
    await deleteMessage(msg, replyMsg)
    return
  }
  if (data.roles === 'senior' || data.roles === 'user') {
    // ============================================================
    // POST APPROVED
    // ============================================================

    // BONUS: for thos who commented and upvoted

    if (post.toLowerCase().includes('upvote') && post.toLowerCase().includes('comment')) {
      pendingMessage(msg, '<@330221961684713474>', link[0], weightage)
      return
    }

    // Senior will get bonus percentage
    if (data.roles === 'senior') weightage += BONUS_WEIGHTAGE
    const username: string = process.env.TEAMMALAYSIA || process.env.STEEM_USERNAME
    const posting: string = process.env.TEAMMALAYSIA_POSTING || process.env.STEEM_POSTING
    await comment(username, posting, authorName.substring(1), permlinkName, '', steem)
      .then(() => {
        return upvote(
          process.env.STEEM_USERNAME,
          process.env.STEEM_POSTING,
          authorName.substring(1),
          permlinkName,
          weightage,
          steem
        )
          .then(async () => {
            await updateUserTime(msg.author.id, msg.createdTimestamp)
            await templateMessage(msg, `you may have a :cookie: coming to you soon!`, Color.green)
          })
          .catch((err: SteemUpvoteError) => {
            msg.delete()
            upvoteErrMsg(msg, err)
            return
          })
      })
      .catch(err => {
        upvoteErrMsg(msg, err)
        templateMessage(
          msg,
          `[<@${msg.author.id}>] Unable to comment (maybe too many people posting on post promo)`,
          Color.red
        )
      })
  } else if (data.roles === 'probation') {
    pendingMessage(msg, `Probation User 🚼`, link[0], weightage)
    return
  } else {
    deleteMessage(msg, 'role not found')
    return
  }
}

export default promo
