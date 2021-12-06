import { useEffect, useState, useRef } from 'react'
import { ChakraProvider, Button, useToast } from '@chakra-ui/react'
import { DownloadIcon } from '@chakra-ui/icons'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import type { AppProps, AppContext } from 'next/app'

import { NAME_ACCOUNT_ID } from 'src/utils/constants'
import { getStores, StoreProvider, TInitialStoreData } from 'src/store/RootStore'

const queryClient = new QueryClient()

type TCustomProps = {
  initialStoreData: TInitialStoreData
}

function Updater() {
  const toast = useToast()
  const isFirstCall = useRef(true)

  useEffect(() => {
    // @ts-ignore
    if (typeof window !== `undefined` && `serviceWorker` in navigator && window.workbox !== undefined) {
      // @ts-ignore
      const wb = window.workbox

      const handleUpdate = () => {
        toast({
          duration: null,
          render: ({ onClose }) => (
            <Button
              leftIcon={<DownloadIcon />}
              colorScheme={`teal`}
              size={`lg`}
              isFullWidth
              onClick={() => {
                wb.addEventListener(`controlling`, () => {
                  if (isFirstCall.current) {
                    isFirstCall.current = false
                    window.location.reload()
                    onClose()
                  }
                })

                wb.messageSkipWaiting()
              }}
            >
              Update App! ✨
            </Button>
          ),
        })
      }

      wb.addEventListener(`waiting`, handleUpdate)
      wb.register()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

function MyApp({ Component, pageProps, initialStoreData }: AppProps & TCustomProps) {
  const stores = getStores(initialStoreData)
  const [ready, readySet] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const userId = Cookies.get(NAME_ACCOUNT_ID)
    const LOGIN_ROUTE = `/login`

    if (router.route !== LOGIN_ROUTE && !userId) {
      window.location.href = LOGIN_ROUTE
      return
    }

    readySet(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!ready) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Head>
          <meta name={`viewport`} content={`initial-scale=1.0, width=device-width`} />
          <link rel={`manifest`} href={`/manifest.json`} />
          <link rel={`icon`} href={`/favicon.ico`} sizes={`any`} />
          <link rel={`icon`} href={`/icon.svg`} type={`image/svg+xml`} />
          <link rel={`apple-touch-icon`} href={`/apple-touch-icon.png`}></link>
        </Head>
        <Updater />
        <StoreProvider value={stores}>
          <Component {...pageProps} />
        </StoreProvider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const mobxStores = getStores()

  appContext.ctx.mobxStores = mobxStores

  const appProps = await App.getInitialProps(appContext)

  // FIXME: почему вызывается при смене страницы?
  const initialStoreData: TInitialStoreData = {
    StoreGameTrophies: mobxStores.StoreGameTrophies.hydrate(),
    StoreStrategeTips: mobxStores.StoreStrategeTips.hydrate(),
    StoreUserProfile: mobxStores.StoreUserProfile.hydrate(),
    StoreUserTrophies: mobxStores.StoreUserTrophies.hydrate(),
  }

  return {
    ...appProps,
    initialStoreData,
  }
}

export default MyApp
