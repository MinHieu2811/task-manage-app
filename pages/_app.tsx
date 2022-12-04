import '../styles/globals.css'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider } from '@mui/material'
import { theme, createEmotionCache } from '@/utils/index'
import { EmptyLayout } from '@/component/layout/'
import { AppPropsWithLayout } from '@/models/layout'
import { Helmet, Loading } from '@/component/common'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from 'config/firebase'
import { useEffect } from 'react'
import { collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore'
import LoginPage from './login'
import { NotiProvider } from '@/component/common/notification/noti-context'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import { useRouter } from 'next/router'
const clientSideEmotionCache = createEmotionCache()

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppPropsWithLayout) {
  const Layout = Component.Layout ?? EmptyLayout

  const [loggedInUser, loading, error] = useAuthState(auth)

  useEffect(() => {
    const setUserInDb = async () => {
      try {
        await setDoc(
          doc(db, 'users', loggedInUser?.email as string),
          {
            email: loggedInUser?.email,
            lastSeen: serverTimestamp(),
            photoURL: loggedInUser?.photoURL,
          },
          { merge: true },
        )
      } catch (err) {
        console.log(err)
      }
    }

    if (loggedInUser) {
      setUserInDb()
    }
  }, [loggedInUser])

  if (loading)
    return (
      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <EmptyLayout>
              {/* <NotiProvider> */}
              <Loading isLoading={loading} />
              {/* </NotiProvider> */}
            </EmptyLayout>
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    )

  if (!loggedInUser)
    return (
      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            {/* <NotiProvider> */}
            <LoginPage />
            {/* </NotiProvider> */}
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    )

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <Layout>
            {/* <NotiProvider> */}
            <Component {...pageProps} />
            {/* </NotiProvider> */}
          </Layout>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  )
}
export default MyApp
