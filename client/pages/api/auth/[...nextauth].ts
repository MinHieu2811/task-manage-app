import NextAuth, { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/utils/mongodb";
import jwt from 'jsonwebtoken'

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    Facebook({
      clientId: process.env.FACEBOOK_ID || '',
      clientSecret: process.env.FACEBOOK_SECRET || '',
    }),
    Google({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
  ],
  theme: {
    colorScheme: "dark",
  },
  callbacks: {
    async session({session, user }) {
      
      if(session.user && user && user?.email) {
        const id = user.id
        const token = jwt.sign(session?.user, process.env.JWT_SECRET || '', {
          expiresIn: '8h'
        })
        // add field id to session.user
        session.user.id = id
        session.user.token = token
      }
      return session
    },
    async jwt({token, user, account, profile, isNewUser}) {
      if(user && user?.id) {
        token.id = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  }
}
export default NextAuth(authOptions)
