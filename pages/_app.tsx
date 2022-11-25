import '../styles/globals.css'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider } from '@mui/material'
import { theme, createEmotionCache } from '@/utils/index'
import { EmptyLayout } from 'components/layout'
import { AppPropsWithLayout } from '@/models/layout'
import Loading from '@/component/common/loading'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from 'config/firebase'
import { useEffect } from 'react'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import LoginPage from './login'
const clientSideEmotionCache = createEmotionCache()

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: AppPropsWithLayout) {
  const Layout = Component.Layout ?? EmptyLayout

  const [loggedInUser, loading, error] = useAuthState(auth)

  useEffect(() => {
    const setUserInDb = async () => {
      try {
        await setDoc(
          doc(db, 'users', loggedInUser?.email as string), {
          email: loggedInUser?.email,
          lastSeen: serverTimestamp(),
          photoURL: loggedInUser?.photoURL
        },
          { merge: true }
        )
      } catch (err) {
        console.log(err)
      }
    }

    if (loggedInUser) {
      setUserInDb()
    }
  }, [loggedInUser])

  if (loading) return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <EmptyLayout>
          <Loading isLoading={loading} />
        </EmptyLayout>
      </ThemeProvider>
    </CacheProvider>
  )

  if (!loggedInUser) return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <LoginPage />
      </ThemeProvider>
    </CacheProvider>
  )

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  )
}
export default MyApp