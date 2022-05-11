import { Heading, Container, Link } from '@chakra-ui/react'

const TokenExpiredPage = () => {
  return (
    <Container maxW={`container.md`} mt={`20`}>
      <Heading mb={3}>Server error. There`s nothing you can do. Wait for the admin to fix it (he already knows)</Heading>
      <Link href={`/`} color={`teal.500`}>
        Try go home
      </Link>
    </Container>
  )
}

export default TokenExpiredPage
