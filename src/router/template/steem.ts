const removeMd = require('remove-markdown')
import { Client } from 'dsteem'
import { SteemUpvoteError, SteemPostInfo } from '../../module'
import { steem } from '../../initialize'
import { MESSAGE_LIST } from '../../config'

const upvote = async (
  username: string,
  posting: string,
  author: string,
  permlink: string,
  percentage: number,
  steem: any
) => {
  const weightage = percentage * 100
  return await new Promise((resolve, reject) => {
    return steem.broadcast.vote(
      posting,
      username,
      author,
      permlink,
      weightage,
      (err: SteemUpvoteError, result: any) => {
        console.log(err, result)
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
    )
  })
}

const comment = async (
  username: string,
  posting: string,
  author: string,
  permlink: string,
  moderator: string,
  steem: any
) => {
  let message: string
  let messageTemplate = randomMessage()
  if (moderator !== '') {
    message = `Your post has been manually curated by ${moderator}\n${messageTemplate}`
  } else {
    message = messageTemplate
  }

  return await new Promise((resolve, reject) => {
    return steem.broadcast.comment(
      posting,
      author,
      permlink,
      username,
      randomName(10),
      '',
      message,
      {
        tags: ['teammalaysiadevtest', 'teammalaysia'],
        app: 'stephard/0.1'
      },
      (err: SteemUpvoteError, result: any) => {
        console.log(err, result)
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
    )
  })
}

// randomName: Generate random name
let randomName = (n: number): string => {
  let text: string = ''
  let possible: string = 'abcdefghijklmnopqrstuvwxyz1234567890'

  for (var i = 0; i < n; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

const findPost: (author: string, permlink: string) => Promise<SteemPostInfo> = (
  author: string,
  permlink: string
) => {
  return new Promise((resolve, reject) => {
    steem.api.getContent(author, permlink, (err: any, result: any) => {
      if (err) {
        reject(err)
      }

      // check cheetah
      const isCheetah: boolean =
        result.active_votes.filter((data: any) => {
          if (data.voter === 'cheetah') {
            return true
          }
          return false
        }).length !== 0
      if (isCheetah) reject({ err: 'CHEETAH' })

      const isVoted: boolean =
        result.active_votes.filter((data: any) => {
          if (data.voter === process.env.STEEM_USERNAME) {
            return true
          }
          return false
        }).length !== 0

      if (isVoted) reject({ err: 'VOTED' })

      const body: string = removeMd(result.body, {
        gfm: false,
        useImgAltText: false
      })

      const bodyLength: number = body.match(/[\u00ff-\uffff]|\S+/g).length

      const tags: string[] = JSON.parse(result.json_metadata).tags

      resolve({
        author: result.author,
        permlink,
        created: result.created,
        bodyLength,
        tags
      })
    })
  })
}

const randomMessage: () => string = () => {
  let val = Math.floor(Math.random() * MESSAGE_LIST.length)
  return MESSAGE_LIST[val]
}

const getVP: (name: string) => Promise<string> = async (name: string) => {
  const api = new Client('https://api.steemit.com')
  const profile = await api.database.getAccounts([name])
  const user = profile[0] ? profile[0] : null
  if (user) {
    return parseFloat(calcVP(user.last_vote_time, user.voting_power)).toFixed(2)
  } else {
    throw new Error('Account not fount')
  }
}

export const calcVP: (last_vote_time: string, voting_power: number) => string = (
  last_vote_time: string,
  voting_power: number
) => {
  const secondsago = (new Date().getTime() - new Date(last_vote_time + 'Z').getTime()) / 1000
  const vpow = voting_power + (10000 * secondsago) / 432000
  const vmin = Math.min(vpow / 100, 100).toFixed(2)
  return vmin
}

export { upvote, comment, findPost, getVP }
