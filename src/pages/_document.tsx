import { ColorModeScript } from '@chakra-ui/react'
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'
import theme from 'src/ui/theme'

const globalStyles = `
  body {
    overflow-y: scroll;
  }

  body::-webkit-scrollbar {
    width: 5px;
  }

  body::-webkit-scrollbar-track {
    background: transparent;
  }

  body::-webkit-scrollbar-thumb {
    background-color: var(--chakra-colors-teal-600);
    border-radius: 20px;
  }
`

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html lang={`ru`}>
        <Head>
          <title>Trophy Hunter</title>
          <link rel={`manifest`} href={`/manifest.json`} />
          <link rel={`manifest`} href={`/manifest.webmanifest`} />
          <link rel={`icon`} href={`/favicon.ico`} sizes={`any`} />
          <link rel={`icon`} href={`/icon.svg`} type={`image/svg+xml`} />
          <link rel={`apple-touch-icon`} href={`/apple-touch-icon.png`}></link>
        </Head>
        <style>{globalStyles}</style>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
