import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { observer } from 'mobx-react-lite'
import {
  Box,
  Grid,
  SimpleGrid,
  Image,
  Text,
  Link,
  Heading,
  Select,
  VStack,
  Container,
} from '@chakra-ui/react'
import StoreGame, { ISortOptions } from 'src/store/StoreGame'

// https://stackoverflow.com/questions/61040790/userouter-withrouter-receive-undefined-on-query-in-first-render

const GameTrophies = observer(() => {
  const [options, setOptions] = useState<ISortOptions>({ sort: '+rate', filter: 'hideOwned' })

  const { query } = useRouter()

  const id = query.id as string | undefined

  useEffect(() => {
    if (id) {
      StoreGame.fetch(id)
    }
  }, [id])

  if (!id) {
    return null
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target

    setOptions((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Container maxW="container.md">
      <VStack spacing="6" pt="6" align="stretch">
        <Heading>
          <NextLink href="/">
            <Link> 👈 Go to Profile</Link>
          </NextLink>
        </Heading>

        <SimpleGrid spacing="4" alignItems="center" minChildWidth="150px">
          <Box>
            <Select name="sort" value={options.sort} onChange={handleSelect}>
              <option value="-rate">Редкие</option>
              <option value="+rate">Популярные</option>
              <option value="default">По умолчанию</option>
            </Select>
          </Box>
          <Box>
            <Select name="filter" value={options.filter} onChange={handleSelect}>
              <option value="showOwned">Полученные</option>
              <option value="hideOwned">Не полученные</option>
              <option value="default">Все</option>
            </Select>
          </Box>
          <Box>
            Всего: {StoreGame.data[id]?.completed} / {StoreGame.data[id]?.total}
          </Box>
        </SimpleGrid>

        <Grid gap="6">
          {StoreGame.data[id]?.sort(options).map((trophy) => (
            <Box
              p={4}
              display={{ md: 'flex' }}
              key={trophy.trophyId}
              borderWidth="1px"
              borderRadius="lg"
            >
              <Box flexShrink={0}>
                <Image
                  width="100px"
                  height="100px"
                  borderRadius="lg"
                  src={trophy.trophyIconUrl}
                  alt={trophy.trophyName}
                  loading="lazy"
                  objectFit="cover"
                  ignoreFallback
                />
              </Box>
              <Box mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
                <Text
                  fontWeight="bold"
                  textTransform="uppercase"
                  fontSize="sm"
                  letterSpacing="wide"
                  color="teal.600"
                >
                  {trophy.trophyEarnedRate}%
                </Text>
                <Text
                  mt={1}
                  display="block"
                  fontSize="lg"
                  lineHeight="normal"
                  fontWeight="semibold"
                >
                  {trophy.trophyName}
                </Text>
                <Text mt={2} color="gray.500">
                  {trophy.trophyDetail}
                </Text>
              </Box>
            </Box>
          ))}
        </Grid>
      </VStack>
    </Container>
  )
})

export default GameTrophies
