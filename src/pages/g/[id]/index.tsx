import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { observer } from 'mobx-react-lite'
import {
  Box,
  Button,
  Grid,
  SimpleGrid,
  Image,
  Text,
  Link,
  Heading,
  Select,
  VStack,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Spinner,
  UnorderedList,
  ListItem,
  IconButton,
} from '@chakra-ui/react'
import { WarningIcon, StarIcon, ExternalLinkIcon, CheckIcon, RepeatIcon } from '@chakra-ui/icons'

import { GAME_NP_PREFIX } from 'src/utils/constants'
import StoreUserTrophies from 'src/store/StoreUserTrophies'
import StoreGame, { ISortOptions } from 'src/store/StoreGame'
import StoreStrategeGame from 'src/store/StoreStrategeGame'
import { storageSlugs } from 'src/utils/storageSlugs'

// https://stackoverflow.com/questions/61040790/userouter-withrouter-receive-undefined-on-query-in-first-render

const styles = `
  a {
    color: var(--chakra-colors-teal-600);
    transition: all 0.3s;
  }

  a:hover {
    opacity: 0.7;
  }

  img {
    display: inline-block;
  }
`

const Row = ({ trophy, tips }: { trophy: any; tips?: any }) => {
  const props = tips ? {} : { p: 4, borderTopWidth: '1px' }

  return (
    <Box display={{ md: 'flex' }} width="100%" {...props}>
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
      <Box mt={{ base: 4, md: 0 }} ml={{ md: 6 }} textAlign="left" width="100%">
        <Text
          fontWeight="bold"
          textTransform="uppercase"
          fontSize="sm"
          letterSpacing="wide"
          color="teal.600"
          d="flex"
          alignItems="center"
          title={trophy.trophyType}
        >
          <StarIcon
            mr="1"
            color={
              trophy.trophyType === 'platinum'
                ? 'blue.300'
                : trophy.trophyType === 'gold'
                ? 'yellow.300'
                : trophy.trophyType === 'silver'
                ? 'gray.300'
                : 'orange.700'
            }
          />
          {trophy.trophyEarnedRate}%
          {!!(tips && tips.length) && (
            <>
              &nbsp;
              <Text ml="auto" as="span" fontSize="sm" color="gray.500" fontWeight="normal" textTransform="initial">
                ({tips.length}) tips
              </Text>
            </>
          )}
        </Text>
        <Text mt={1} display="block" fontSize="lg" lineHeight="normal" fontWeight="semibold">
          {trophy.trophyName}
        </Text>
        <Text mt={2} color="gray.500">
          {trophy.trophyDetail}
        </Text>
      </Box>
    </Box>
  )
}

const GameTrophies = observer(() => {
  const [options, setOptions] = useState<ISortOptions>({ sort: '+rate', filter: 'hideOwned' })

  const router = useRouter()

  const id = router.query.id as string | undefined
  const name = router.query.name as string | undefined

  const handleGoToMatch = () => {
    // name нужен для ручной синхронизации (для строки поиска stratege)
    // можно будет заменить, если найти способ фетча конкретной игры
    router.push(`/m/${id}?name=${name}`)
  }

  // @ts-ignore
  const slug = id && (localStorage.getItem(GAME_NP_PREFIX + id) || storageSlugs[id])

  useEffect(() => {
    const init = async () => {
      if (id) {
        if (!StoreGame.data[id]) {
          await StoreGame.fetch(id)
        }

        if (slug) {
          // `slug` - скачиваем по прямой ссылке
          await StoreStrategeGame.fetch(id, { slug })
        } else if (name) {
          // `name` - нужен для автопоиска
          await StoreStrategeGame.fetch(id, { name })
        } else {
          // попытается вытащить из `storageSlugs`, или выдаст ошибку
          await StoreStrategeGame.fetch(id)
        }
      }
    }

    init()
  }, [id, name, slug])

  if (!id) {
    return null
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target
    setOptions((prev) => ({ ...prev, [name]: value }))
  }

  const suggests = StoreGame.data[id]?.sort(options)

  const gameName = StoreUserTrophies.data?.trophyTitles.find(
    ({ npCommunicationId }) => npCommunicationId === id
  )?.trophyTitleName

  return (
    <Container maxW="container.md">
      <Head>
        <title>{gameName}</title>
      </Head>
      <VStack spacing="6" mt={6} align="stretch">
        <Text d="flex" alignItems="center">
          <Link onClick={() => router.back()}>👈 Go to Profile</Link>
          <Box ml="auto">
            {StoreStrategeGame.data[id]?.loading ? (
              <Button disabled rightIcon={<Spinner />}>
                Tips loading
              </Button>
            ) : StoreStrategeGame.data[id]?.error ? (
              <Button rightIcon={<WarningIcon />} onClick={handleGoToMatch}>
                Sync manual
              </Button>
            ) : StoreStrategeGame.data[id]?.data && slug ? (
              <Link isExternal href={`https://www.stratege.ru/ps4/games/${slug}/trophies`}>
                <Button rightIcon={<ExternalLinkIcon />}>Open in Stratege</Button>
              </Link>
            ) : StoreStrategeGame.data[id]?.data ? (
              <Button disabled rightIcon={<CheckIcon />}>
                Auto detected
              </Button>
            ) : (
              <IconButton disabled icon={<RepeatIcon />} aria-label="loading" />
            )}
          </Box>
        </Text>

        {gameName && (
          <Heading>
            {gameName}{' '}
            <Text fontSize="xs" color="teal.600">
              {id}
            </Text>
          </Heading>
        )}

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
          {StoreGame.data[id] ? (
            <Box>
              Получено: {StoreGame.data[id].completed}{' '}
              <Text color="gray.500" as="span">
                / {StoreGame.data[id].total}
              </Text>
            </Box>
          ) : (
            <Box>&nbsp;</Box>
          )}
        </SimpleGrid>
        {suggests && suggests.length > 0 ? (
          <Grid>
            <style>{styles}</style>
            <Accordion allowToggle>
              {suggests.map((trophy: any) => {
                const tips = StoreStrategeGame.data[id]?.data
                  ?.find(({ description, titleRu, titleEng }) => {
                    // INFO: на стратеге переведены не все тайтлы
                    const compareByNameRu = titleRu === trophy.trophyName
                    const compareByNameEng = titleEng === trophy.trophyName
                    // INFO: в апихе тратеге все дескрипшены с точкой на конце
                    const compareByDescription = description === trophy.trophyDetail + '.'
                    const result = compareByNameRu || compareByNameEng || compareByDescription

                    return result
                  })
                  ?.tips.filter(({ text }) => text)

                if (!tips || !tips.length) {
                  return <Row trophy={trophy} key={trophy.trophyId} />
                }

                return (
                  <AccordionItem key={trophy.trophyId}>
                    <AccordionButton p="4">
                      <Row trophy={trophy} tips={tips} />
                    </AccordionButton>
                    <AccordionPanel>
                      <UnorderedList>
                        {tips?.map((item, key) => (
                          <ListItem key={key} dangerouslySetInnerHTML={{ __html: item.text }} mt="5" />
                        ))}
                      </UnorderedList>
                    </AccordionPanel>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </Grid>
        ) : StoreStrategeGame.data[id]?.loading ? (
          <Text>Loading...</Text>
        ) : StoreGame.data[id] && StoreGame.data[id]?.completed === StoreGame.data[id]?.total ? (
          <Text>All trophies earned!</Text>
        ) : null}
      </VStack>
    </Container>
  )
})

export default GameTrophies
