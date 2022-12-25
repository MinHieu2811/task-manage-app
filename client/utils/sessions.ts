import { User } from '@/models/user'
import type { IronSessionOptions } from 'iron-session'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'iron-session/taskido/next.js/node.js',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

export const validateToken = (token: string) => {
  jwt.verify(token, process.env.JWT_SECRET || '', (err: any) => {
    if(err instanceof JsonWebTokenError) {
      return false
    }
  })

  return true
}

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    user?: User
    token?: string
  }
}