import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { WarningIcon, ExternalLinkIcon, CheckIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Grid,
  SimpleGrid,
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
  Checkbox,
  useBreakpointValue,
} from '@chakra-ui/react'

import { ISortOptions } from 'src/store/StoreGame'
import { useMobxStores } from 'src/store/RootStore'
import { NAME_GAME_NP_PREFIX, NAME_TROPHY_HIDDEN, NAME_TROPHY_DLC, NAME_TROPHY_FILTER } from 'src/utils/constants'
import { storageSlugs } from 'src/utils/storageSlugs'
import { StarsRow } from 'src/ui/StarsRow'
import { TrophyRow } from 'src/ui/TrophyRow'
import { useTogglers } from 'src/hooks/useTogglers'

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

const GameTrophies = observer(() => {
  const { storeGame, storeStrategeGame, storeUserTrophies } = useMobxStores()
  const [options, setOptions] = useState<ISortOptions>({
    sort: `+rate`,
    filter:
      (`window` in globalThis && (window?.localStorage.getItem(NAME_TROPHY_FILTER) as ISortOptions[`filter`])) ||
      `hideOwned`,
  })

  const { showHidden, showHiddenSet, hideDlc, hideDlcSet } = useTogglers()

  const router = useRouter()
  const size = useBreakpointValue({ base: `xs`, md: `md` })

  const id = router.query.id as string | undefined
  const name = router.query.name as string | undefined

  const handleGoToMatch = () => {
    // name нужен для ручной синхронизации (для строки поиска stratege)
    // можно будет заменить, если найти способ фетча конкретной игры
    router.replace(`/m/${id}?name=${name}`)
  }

  // @ts-ignore
  const slug = id && ((`window` in globalThis && localStorage.getItem(NAME_GAME_NP_PREFIX + id)) || storageSlugs[id])

  useEffect(() => {
    const init = async () => {
      if (id) {
        if (!storeGame.data[id]) {
          await storeGame.fetch(id)
        }

        if (slug) {
          // `slug` - скачиваем по прямой ссылке
          await storeStrategeGame.fetch(id, { slug })
        } else if (name) {
          // `name` - нужен для автопоиска
          await storeStrategeGame.fetch(id, { name })
        } else {
          // попытается вытащить из `storageSlugs`, или выдаст ошибку
          await storeStrategeGame.fetch(id)
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

    if (name === `filter`) {
      localStorage.setItem(NAME_TROPHY_FILTER, value)
    }
  }

  const trophies = storeGame.data[id]
    ?.sort(options)
    .filter(({ trophyGroupId }) => !(hideDlc && trophyGroupId !== `default`))

  const game = storeUserTrophies.findById(id)

  return (
    <Container maxW={`container.md`}>
      <Head>
        <title>{game?.trophyTitleName}</title>
      </Head>
      <VStack spacing={`6`} mt={6} align={`stretch`}>
        <Box d={`flex`} alignItems={`center`}>
          <Link onClick={() => router.back()}>👈 Go to Profile</Link>
          <Box ml={`auto`} d={`flex`} gridGap={2}>
            {storeStrategeGame.data[id]?.loading ? (
              <Button disabled rightIcon={<Spinner size={size} />} size={size}>
                Loading
              </Button>
            ) : storeStrategeGame.data[id]?.error ? (
              <Button rightIcon={<WarningIcon />} onClick={handleGoToMatch} size={size}>
                Manual
              </Button>
            ) : storeStrategeGame.data[id]?.data && slug ? (
              <Link isExternal href={`https://www.stratege.ru/ps4/games/${slug}/trophies`} d={`flex`}>
                <Button rightIcon={<ExternalLinkIcon />} size={size}>
                  Open in Stratege
                </Button>
              </Link>
            ) : storeStrategeGame.data[id]?.data ? (
              <>
                <Button disabled rightIcon={<CheckIcon />} size={size}>
                  Auto
                </Button>
                <Button rightIcon={<WarningIcon />} size={size} onClick={handleGoToMatch}>
                  Manual
                </Button>
              </>
            ) : (
              <IconButton disabled icon={<Spinner size={size} />} aria-label={`loading`} size={size} />
            )}
          </Box>
        </Box>

        {game && (
          <>
            <Heading>
              {game.trophyTitleName}
              {` `}
              <Text fontSize={`xs`} color={`teal.600`}>
                {id}
              </Text>
            </Heading>
            <StarsRow game={game} />
          </>
        )}

        <SimpleGrid spacing={`4`} alignItems={`center`} minChildWidth={`150px`}>
          <Box>
            <Select name={`sort`} value={options.sort} onChange={handleSelect}>
              <option value={`-rate`}>Редкие</option>
              <option value={`+rate`}>Популярные</option>
              <option value={`default`}>По умолчанию</option>
            </Select>
          </Box>
          <Box>
            <Select name={`filter`} value={options.filter} onChange={handleSelect}>
              <option value={`showOwned`}>Полученные</option>
              <option value={`hideOwned`}>Не полученные</option>
              <option value={`default`}>Все</option>
            </Select>
          </Box>
        </SimpleGrid>

        {storeGame.data[id] && (
          <Box d={`grid`}>
            <Box fontSize={`xs`}>
              Получено: {storeGame.data[id].completed}
              {` `}
              <Text color={`gray.500`} as={`span`}>
                / {storeGame.data[id].total}
              </Text>
            </Box>
            <Checkbox
              onChange={(evt) => {
                showHiddenSet(evt.target.checked)
                localStorage.setItem(NAME_TROPHY_HIDDEN, JSON.stringify(evt.target.checked))
              }}
              isChecked={showHidden}
              color={`teal.500`}
              size={`sm`}
            >
              Показать скрытые
            </Checkbox>
            <Checkbox
              onChange={(evt) => {
                hideDlcSet(evt.target.checked)
                localStorage.setItem(NAME_TROPHY_DLC, JSON.stringify(evt.target.checked))
              }}
              isChecked={hideDlc}
              color={`teal.500`}
              size={`sm`}
            >
              Скрыть DLC
            </Checkbox>
          </Box>
        )}

        {trophies && trophies.length > 0 ? (
          <Grid>
            <style>{styles}</style>
            <Accordion allowToggle>
              {trophies.map((trophy) => {
                const tips = storeStrategeGame.data[id]?.data
                  ?.find(({ description, titleRu, titleEng }) => {
                    // INFO: у stratege переведены не все тайтлы
                    const compareByNameRu = titleRu === trophy.trophyName
                    const compareByNameEng = titleEng === trophy.trophyName
                    // INFO: у stratege все дескрипшены с точкой на конце
                    const compareByDescription = description === trophy.trophyDetail + `.`
                    const result = compareByNameRu || compareByNameEng || compareByDescription

                    return result
                  })
                  ?.tips.filter(({ text }) => text)

                if (!tips || !tips.length) {
                  return <TrophyRow trophy={trophy} key={trophy.trophyId} showHidden={showHidden} />
                }

                return (
                  <AccordionItem key={trophy.trophyId}>
                    <AccordionButton p={`4`}>
                      <TrophyRow trophy={trophy} tips={tips} showHidden={showHidden} />
                    </AccordionButton>
                    <AccordionPanel>
                      <UnorderedList>
                        {tips?.map((item, key) => (
                          <ListItem key={key} dangerouslySetInnerHTML={{ __html: item.text }} mt={`5`} />
                        ))}
                      </UnorderedList>
                    </AccordionPanel>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </Grid>
        ) : storeStrategeGame.data[id]?.loading ? (
          <Text>Loading...</Text>
        ) : storeGame.data[id] && storeGame.data[id]?.completed === storeGame.data[id]?.total ? (
          <Text>All trophies earned!</Text>
        ) : storeGame.data[id] ? (
          <Text>Nothing to show! Change filters</Text>
        ) : null}
      </VStack>
    </Container>
  )
})

export default GameTrophies
