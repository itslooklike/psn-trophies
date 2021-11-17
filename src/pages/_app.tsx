import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Head>
        <title>Trophy Hunter</title>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
export default MyApp
