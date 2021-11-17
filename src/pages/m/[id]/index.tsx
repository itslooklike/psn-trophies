import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { Image, Box, Container, Text, Spinner, Heading, Link, IconButton } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

import StoreStrategeGame, { TStrategeGame } from 'src/store/StoreStrategeGame'
import { GAME_NP_PREFIX } from 'src/utils/constants'
import { getStrategeSearchUrl } from 'src/utils'

const GameTrophies = observer(() => {
  const router = useRouter()
  const [list, listSet] = useState<TStrategeGame[]>([])

  const id = router.query.id as string | undefined
  const name = router.query.name as string | undefined

  useEffect(() => {
    if (name && id) {
      const init = async () => {
        const data = await StoreStrategeGame.fetchList(name)
        listSet(data)
      }

      init()
    }
  }, [name, id])

  if (!name || !id) {
    return null
  }

  const handleSaveToStore = (slug: string) => {
    localStorage.setItem(GAME_NP_PREFIX + id, slug)
    router.push(`/g/${id}?name=${name}`)
  }

  if (StoreStrategeGame.loadingList) {
    return (
      <Container maxW="container.md" mt={6}>
        <Box d="flex" justifyContent="center" alignItems="center" gridGap="5">
          <Heading>Loading...</Heading>
          <Spinner />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxW="container.md" mt={6}>
      <Text d="flex" alignItems="center">
        <NextLink href="/">
          <Link>👈 Go to Profile</Link>
        </NextLink>
        <Link ml="auto" color="teal.500" isExternal href={getStrategeSearchUrl(name)}>
          Open in Stratege <ExternalLinkIcon />
        </Link>
      </Text>

      <Heading mt="5" mb="10" textAlign="center">
        {name}
      </Heading>

      <Text color="teal.500" fontSize="sm" textAlign="center">
        Выберите PS4 игру для синхронизации
      </Text>

      {list.map((item: any, index: any) => {
        return (
          <Box
            onClick={() => handleSaveToStore(item.slug)}
            cursor="pointer"
            key={index}
            p={4}
            display={{ md: 'flex' }}
            width="100%"
            alignItems="center"
            borderWidth="1px"
            borderRadius="lg"
            mt="2"
          >
            <Box flexShrink={0}>
              <Image
                width="50px"
                height="50px"
                borderRadius="lg"
                src={item.img}
                alt={item.title}
                loading="lazy"
                objectFit="cover"
                ignoreFallback
              />
            </Box>
            <Box mt={{ base: 4, md: 0 }} ml={{ md: 6 }} textAlign="left">
              <Text display="block" fontSize="lg" lineHeight="normal" fontWeight="semibold">
                {item.title}
              </Text>
              <Text color="teal.600" fontSize="sm">
                {item.slug}
              </Text>
            </Box>
          </Box>
        )
      })}
    </Container>
  )
})

export default GameTrophies
