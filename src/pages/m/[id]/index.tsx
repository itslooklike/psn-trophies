import NextLink from 'next/link'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { Image, Box, Container, Text, Spinner, Heading, Link, Button } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

import { NAME_GAME_NP_PREFIX } from 'src/utils/config'
import { fmtSearchUrl } from 'src/utils/fmt'
import { localStore } from 'src/utils/localStore'
import { useMobxStores } from 'src/store/RootStore'
import type { TScrapListResponse } from 'src/pages/api/scrap-list'

const TGameTrophies = observer(() => {
  const { StoreStrategeTips, StoreGameTrophies, StoreUserTrophies } = useMobxStores()
  const router = useRouter()
  const [list, listSet] = useState<TScrapListResponse>()

  const id = router.query.id as string

  const gameName = StoreGameTrophies.data[id]!.data.trophyTitleName
  const game = StoreUserTrophies.findById(id)!

  useEffect(() => {
    const init = async () => {
      if (!StoreGameTrophies.data[id] && !StoreGameTrophies.loading) {
        await StoreGameTrophies.fetch(id)
      }

      const data = await StoreStrategeTips.fetchList(gameName!)

      listSet(data)
    }

    init()
  }, [id, StoreStrategeTips, gameName, StoreGameTrophies])

  if (!id || !game) {
    router.replace(`/`)
    return null
  }

  const handleSaveToStore = (slug: string) => {
    localStore.setItem(NAME_GAME_NP_PREFIX + id, slug)
    router.replace(`/g/${id}`)
  }

  const handleLoadMore = async () => {
    const data = await StoreStrategeTips.fetchList(gameName!, list?.nextPage)

    const newData = {
      payload: [...list!.payload, ...data.payload],
      nextPage: data.nextPage,
    }

    listSet(newData)
  }

  const isTipsLoading = !list?.payload && StoreStrategeTips.loadingList

  if (!gameName || isTipsLoading) {
    return (
      <Container maxW={`container.md`} mt={6}>
        <Head>
          <title>Loading...</title>
        </Head>
        <Box d={`flex`} justifyContent={`center`} alignItems={`center`} gridGap={`5`}>
          <Heading>Loading...</Heading>
          <Spinner />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxW={`container.md`} mt={6}>
      <Head>
        <title>Choose Game</title>
      </Head>
      <Text d={`flex`} alignItems={`center`}>
        <NextLink href={`/`} passHref>
          <Link>👈 Go to Profile</Link>
        </NextLink>
        <Link ml={`auto`} isExternal href={fmtSearchUrl(gameName)}>
          <Button rightIcon={<ExternalLinkIcon />}>Open in Stratege</Button>
        </Link>
      </Text>

      <Heading mt={`5`} mb={`10`} textAlign={`center`}>
        {gameName}
      </Heading>

      <Text color={`teal.500`} fontSize={`sm`} textAlign={`center`}>
        Выберите PS игру для синхронизации
      </Text>

      {list?.payload.map((item, index) => (
        <Box
          key={index}
          onClick={() => handleSaveToStore(item.slug)}
          cursor={`pointer`}
          p={4}
          width={`100%`}
          alignItems={`center`}
          borderWidth={`1px`}
          borderRadius={`lg`}
          mt={`2`}
          d={`flex`}
          transition={`all 0.3s`}
          _hover={{
            backgroundColor: `gray.700`,
            borderColor: `transparent`,
          }}
        >
          <Box flexShrink={0}>
            <Image
              width={`50px`}
              height={`50px`}
              borderRadius={`lg`}
              src={item.img}
              alt={item.title}
              loading={`lazy`}
              objectFit={`cover`}
              ignoreFallback
            />
          </Box>
          <Box ml={6} textAlign={`left`}>
            <Text
              display={`block`}
              fontSize={`lg`}
              lineHeight={`normal`}
              fontWeight={`semibold`}
              dangerouslySetInnerHTML={{
                __html: item.title.replace(new RegExp(game.trophyTitlePlatform, `gi`), (match) => `<mark>${match}</mark>`),
              }}
            ></Text>
            <Text color={`teal.600`} fontSize={`sm`} wordBreak={`break-word`}>
              {item.slug}
            </Text>
          </Box>
        </Box>
      ))}

      {list?.nextPage && (
        <Box d={`flex`} justifyContent={`center`} mt={6} pb={6}>
          <Button isLoading={StoreStrategeTips.loadingList} onClick={handleLoadMore}>
            Загрузить еще
          </Button>
        </Box>
      )}
    </Container>
  )
})

export default TGameTrophies
