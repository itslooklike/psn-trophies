import Head from 'next/head'
import { observer } from 'mobx-react-lite'
import { Container, Heading } from '@chakra-ui/react'

const Offline = observer(() => {
  return (
    <Container maxW={`container.md`} mt={`20`}>
      <Head>
        <title>You are offline</title>
      </Head>
      <Heading>You are offline</Heading>
    </Container>
  )
})

export default Offline
