export interface SteemAccountError {
  name: string
  message: string
  type: string
  errno: string
  code: string
}

export interface SteemUpvoteError {
  cause: {
    name: string
    code: number
    data: {
      code: number
      name: string
      message: string
      stack: any
    }
  }
  isOperational: boolean
  code: number
  data: {
    code: number
    name: string
    message: string
    stack: any
  }
}

export interface SteemPostInfo {
  author: string
  permlink: string
  created: string
  bodyLength: number
  tags: string[]
}

export interface PostPromoRule {
  maximumPostAge: number
  minimumPostAge: number
  minimumLength: number
  optimumLength: number
  unwantedTags: string[]
  requiredTags: string[]
  pendingTags: string[]
}

export interface UserData {
  name: string
  discordid: string
  steemname: string
  roles: 'user' | 'senior' | 'ban'
  lastpostdatetime: number[]
}
