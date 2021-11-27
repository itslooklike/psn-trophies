import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import Head from 'next/head'
import App from 'next/app'
import type { AppProps, AppContext } from 'next/app'

import { getStores, StoreProvider, TInitialStoreData } from 'src/store/RootStore'

const queryClient = new QueryClient()

type TCustomProps = {
  initialStoreData: TInitialStoreData
}

function MyApp({ Component, pageProps, initialStoreData }: AppProps & TCustomProps) {
  const stores = getStores(initialStoreData)

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Head>
          <title>Trophy Hunter</title>
          <link rel={`manifest`} href={`/manifest.webmanifest`} />
          <link rel={`icon`} href={`/favicon.ico`} sizes={`any`} />
          <link rel={`icon`} href={`/icon.svg`} type={`image/svg+xml`} />
          <link rel={`apple-touch-icon`} href={`/apple-touch-icon.png`}></link>
        </Head>

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
    StoreTrophyGroups: mobxStores.StoreTrophyGroups.hydrate(),
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
