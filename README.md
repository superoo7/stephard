# Stephard Bot

![Stephard Bot](https://steemitimages.com/0x0/https://res.cloudinary.com/hpiynhbhq/image/upload/v1519185607/sc48hmou7bixusgjlcv5.png)

A bot that prevent abuse on post-promo channel of steem community.

# To Do

- Merged 2 repository into 1 
    - [oo7-discord](https://github.com/superoo7/oo7-discord)
    - [oo7-discord-reg](https://github.com/superoo7/oo7-discord-reg) [DONE]
- Add more testing
- Add in a pending role

# Feature
## User
### Registration Channel

- Register their steemname and link to their discord account
- Check their last post time and remaining cooldown on post promo channel

### Post Promo Channel

- Post promo channel checks for the quality of the post:
    - Is it voted by cheetah
    - Is it fulfill the minimum length required
    - Does it contain required Tag
    - Does it contain banned Tag
    - Does it has some tag that need to be pending for review
    - Short description is required for sharing the post
- If user shared a post without waiting for cooldown, the bot will delete the message
- If user are ban they are not allowed to share their post
- The bot will reward users with an upvote (with trail) and leave a comment

## Moderator

There is a special moderator channel for administration purpose

- Put the bot into maintenance mode
- Ban some of the users
- Manually upvote a certain post in pending
- Check status of a certain person

# Technology

Typescript, Node.js, Jest, MongoDB

# Developer

* edit `.env.sample` file into `.env`

```
DISCORD_TOKEN=
STEEM_USERNAME=
STEEM_POSTING=
```

* edit `src/config-sample.ts` into `src/config.ts`

# License
MIT