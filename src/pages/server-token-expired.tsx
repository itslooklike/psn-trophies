import { Heading, Container } from '@chakra-ui/react'

export default function () {
  return (
    <Container maxW={`container.md`} mt={`20`}>
      <Heading>
        Server error. There's nothing you can do. Wait for the admin to fix it (he already knows)
      </Heading>
    </Container>
  )
}
