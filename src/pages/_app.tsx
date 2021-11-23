import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import Head from 'next/head'
import type { AppProps } from 'next/app'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
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
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  )
}
export default MyApp
