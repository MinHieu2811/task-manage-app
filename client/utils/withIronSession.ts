import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next'
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'
import { IronSessionOptions } from 'iron-session'
import { User } from '../models'

declare module "iron-session" {
    interface IronSessionData {
        user?: User
    }
}

export const IRON_OPTIONS: IronSessionOptions = {
    cookieName: process.env.IRON_COOKIE_NAME || '',
    password: process.env.IRON_PASSWORD || '',
    ttl: 60 * 2,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    }
}

function withSessionRoute(handler: NextApiHandler) {
    return withIronSessionApiRoute(handler, IRON_OPTIONS)
}

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
    handler: (
        context: GetServerSidePropsContext
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
    return withIronSessionSsr(handler, IRON_OPTIONS)
}

export { withSessionRoute, withSessionSsr }