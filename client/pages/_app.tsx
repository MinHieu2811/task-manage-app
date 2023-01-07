import '../styles/globals.css'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider } from '@mui/material'
import { theme, createEmotionCache } from '@/utils/index'
import { AppPropsWithLayout } from '@/models/layout'
import { NotiProvider } from '@/component/common/notification/noti-context'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import App from 'next/app'
import { SessionProvider } from 'next-auth/react'
const clientSideEmotionCache = createEmotionCache()

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppPropsWithLayout) {
  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
              <NotiProvider>
                <Component {...pageProps} />
              </NotiProvider>
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    </SessionProvider>
  )
}

// MyApp.getInitialProps = async (ctx: any) => {
//   const appProps = App.getInitialProps && (await App.getInitialProps(ctx))
//   return { ...appProps }
// }

export default MyApp
