import { useEffect, useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from 'next/app'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import type { AppProps, AppContext } from 'next/app'

import { NAME_ACCOUNT_ID } from 'src/utils/constants'
import { getStores, StoreProvider, TInitialStoreData } from 'src/store/RootStore'

const queryClient = new QueryClient()

type TCustomProps = {
  initialStoreData: TInitialStoreData
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
