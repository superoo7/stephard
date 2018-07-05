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
