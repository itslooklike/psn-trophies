import { useEffect, useRef } from 'react'
import { ChakraProvider, Button, useToast } from '@chakra-ui/react'
import { DownloadIcon } from '@chakra-ui/icons'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from 'next/app'
import Head from 'next/head'
import type { AppProps, AppContext } from 'next/app'
import Script from 'next/script'

import { getStores, StoreProvider, TInitialStoreData } from 'src/store/RootStore'
import { isProd } from 'src/utils/config'

const yaCode = `
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

ym(87236849, "init", {
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true
});`

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
      {isProd && <Script id={`ya-init`} strategy={`afterInteractive`} dangerouslySetInnerHTML={{ __html: yaCode }} />}
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
