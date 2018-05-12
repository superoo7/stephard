import * as Discord from 'discord.js'

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
      (err: any, result: any) => {
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
  let message = `Your post has been manually curated by ${moderator}<br>
  #### You’ve been upvoted by **TeamMalaysia** Community :- \nTo support the growth of TeamMalaysia Follow our upvotes by using **steemauto.com** and follow trail of @myach\n\nVote **TeamMalaysia** witness bitrocker2020 using this link <a href="https://v2.steemconnect.com/sign/account-witness-vote?witness=bitrocker2020&approve=true">vote for witness</a>\n`

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
      (err: any, result: any) => {
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

export { upvote, comment }
