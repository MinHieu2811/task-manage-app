import { GetServerSidePropsContext } from 'next'
import { withSessionSsr } from '@/utils/index'

export const withAuth = (gssp: any) => {
    return async (context: GetServerSidePropsContext) => {
        const { req } = context
        const user = req?.session?.user

        if (!user) {
            return {
                redirect: {
                    destination: '/login',
                    statusCode: 302,
                },
            }
        }

        return await gssp(context)
    }
}

export const withAuthSsr = (handler: any) => withSessionSsr(withAuth(handler))