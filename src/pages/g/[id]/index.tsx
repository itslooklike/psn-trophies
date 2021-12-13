import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { WarningIcon, ExternalLinkIcon, CheckIcon, ChatIcon } from '@chakra-ui/icons'
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
  List,
  ListItem,
  ListIcon,
  IconButton,
  Checkbox,
  useBreakpointValue,
  Code,
} from '@chakra-ui/react'

import { useMobxStores } from 'src/store/RootStore'
import type { TTrophiesFilters } from 'src/store/StoreGameTrophies'
import {
  NAME_GAME_NP_PREFIX,
  NAME_TROPHY_HIDDEN,
  NAME_TROPHY_DLC,
  N_TROPHY_FILTER,
} from 'src/utils/constants'
import { storageSlugs } from 'src/utils/storageSlugs'
import { localStore } from 'src/utils/localStore'
import { fmtStrategeUrl } from 'src/utils/fmt'
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

  .spoiler_control > div > div {
    background-color: inherit !important;
    border-radius: 0 !important;
  }

  .spoiler_control > .smallfont > input {
    white-space: break-spaces;
    color: inherit !important;
    background-color: inherit !important;
    border-radius: 0 !important;
    text-align: left;
  }

  .spoiler_control > .smallfont > right {
    display: none;
  }
`

type TOptionFilter = 'hideOwned' | 'showOwned' | 'default'
type TOptionSorting = `+rate` | `-rate` | 'default'

const TGameTrophies = observer(() => {
  const { StoreGameTrophies, StoreStrategeTips, StoreUserTrophies } = useMobxStores()
  const [optionSort, optionSortSet] = useState<TOptionSorting>(`+rate`)
  const [optionFilter, optionFilterSet] = useState<TOptionFilter>(localStore(N_TROPHY_FILTER) || `hideOwned`)
  const { showHidden, showHiddenSet, hideDlc, hideDlcSet } = useTogglers()
  const size = useBreakpointValue({ base: `xs`, md: `md` })
  const router = useRouter()

  const id = router.query.id as string

  const game = StoreUserTrophies.findById(id)

  const gameTips = StoreStrategeTips.data[id]

  const gameTrophies = StoreGameTrophies.data[id]

  const slug = id && (localStore(NAME_GAME_NP_PREFIX + id) || storageSlugs[id])

  useEffect(() => {
    const init = async () => {
      if (!id) {
        return
      }

      try {
        if (!gameTrophies) {
          await StoreGameTrophies.fetch(id)
        }

        if (slug) {
          // `slug` - скачиваем по прямой ссылке
          await StoreStrategeTips.fetch(id, { slug })
        } else {
          // `name` - нужен для авто-поиска
          await StoreStrategeTips.fetch(id, { name: gameTrophies!.title })
        }
      } catch {}
    }

    init()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, slug, gameTrophies])

  const handleGoToMatch = () => router.push(`/m/${id}`)

  return (
    <Container maxW={`container.md`}>
      <Head>
        <title>{game?.trophyTitleName}</title>
      </Head>
      <VStack spacing={`6`} mt={6} align={`stretch`}>
        <Box d={`flex`} alignItems={`center`}>
          <NextLink href={`/`}>
            <Link>👈 Go to Profile</Link>
          </NextLink>
          <Box ml={`auto`} d={`flex`} gridGap={2}>
            {gameTips?.loading ? (
              <Button disabled rightIcon={<Spinner size={size} />} size={size}>
                Loading Tips from Stratege...
              </Button>
            ) : gameTips?.error ? (
              <Button rightIcon={<WarningIcon />} onClick={handleGoToMatch} size={size}>
                Sync Manual
              </Button>
            ) : gameTips?.data && slug ? (
              <>
                <Button rightIcon={<WarningIcon />} onClick={handleGoToMatch} size={size}>
                  Sync Manual
                </Button>
                <Link isExternal href={fmtStrategeUrl(slug)} d={`flex`}>
                  <Button rightIcon={<ExternalLinkIcon />} size={size}>
                    Open in Stratege
                  </Button>
                </Link>
              </>
            ) : gameTips?.data ? (
              <>
                <Button disabled rightIcon={<CheckIcon />} size={size}>
                  Auto
                </Button>
                <Button rightIcon={<WarningIcon />} size={size} onClick={handleGoToMatch}>
                  Sync Manual
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
            <Select
              name={`sort`}
              value={optionSort}
              onChange={(event) => optionSortSet(event.target.value as TOptionSorting)}
            >
              <option value={`-rate`}>Редкие</option>
              <option value={`+rate`}>Популярные</option>
              <option value={`default`}>По умолчанию</option>
            </Select>
          </Box>
          <Box>
            <Select
              name={`filter`}
              value={optionFilter}
              onChange={(event) => {
                optionFilterSet(event.target.value as TOptionFilter)
                localStore.setItem(N_TROPHY_FILTER, event.target.value)
              }}
            >
              <option value={`showOwned`}>Полученные</option>
              <option value={`hideOwned`}>Не полученные</option>
              <option value={`default`}>Все</option>
            </Select>
          </Box>
        </SimpleGrid>

        {gameTrophies && (
          <Box d={`grid`}>
            <Box fontSize={`xs`}>
              Получено: {gameTrophies.completed}
              {` `}
              <Text color={`gray.500`} as={`span`}>
                / {gameTrophies.total}
              </Text>
            </Box>
            <Checkbox
              onChange={(evt) => {
                showHiddenSet(evt.target.checked)
                // FIXME: убрать в хуки
                localStore.setItem(NAME_TROPHY_HIDDEN, evt.target.checked)
              }}
              isChecked={showHidden}
              color={`teal.500`}
              size={`sm`}
            >
              Показать скрытые
            </Checkbox>
            {gameTrophies ? (
              <Checkbox
                onChange={(evt) => {
                  hideDlcSet(evt.target.checked)
                  // FIXME: убрать в хуки
                  localStore.setItem(NAME_TROPHY_DLC, evt.target.checked)
                }}
                isChecked={hideDlc}
                color={`teal.500`}
                size={`sm`}
              >
                Скрыть DLC ({gameTrophies.dlcAmount})
              </Checkbox>
            ) : null}
          </Box>
        )}

        {gameTrophies && gameTrophies.data.trophies.length > 0 ? (
          gameTrophies.trophyGroups({ hideDlc }).map((trophyGroup) => {
            let filters: TTrophiesFilters = {}

            if (optionFilter && optionFilter !== `default`) {
              filters[optionFilter] = true
            }

            if (optionSort && optionSort !== `default`) {
              filters.sorting = optionSort
            }

            const trophies = gameTrophies.trophyGroupsById(trophyGroup.trophyGroupId, filters)

            return (
              <Grid key={trophyGroup.trophyGroupId}>
                <style>{styles}</style>
                {trophyGroup.trophyGroupId !== `default` && (
                  <Heading mb={5}>DLC: {trophyGroup.trophyGroupName}</Heading>
                )}
                <Accordion allowToggle>
                  {trophies.map((trophy) => {
                    const tips = StoreStrategeTips.tips(id, trophy)

                    const trophyGroup = gameTrophies.data.trophyGroups.find(
                      ({ trophyGroupId }) => trophyGroupId === trophy.trophyGroupId
                    )

                    const Row = () => (
                      <TrophyRow
                        trophy={trophy}
                        trophyGroup={trophyGroup}
                        key={trophy.trophyId}
                        showHidden={showHidden}
                        tips={tips.length ? tips : undefined}
                      />
                    )

                    if (tips.length) {
                      return (
                        <AccordionItem key={trophy.trophyId}>
                          <AccordionButton p={`4`}>
                            <Row />
                          </AccordionButton>
                          <AccordionPanel>
                            <List>
                              {tips.map((item, key) => (
                                <ListItem key={key} mt={`5`}>
                                  <ListIcon as={ChatIcon} color={`green.500`} />
                                  {item.date && (
                                    <>
                                      <Code>{item.date}</Code>
                                      {` `}
                                    </>
                                  )}
                                  <span dangerouslySetInnerHTML={{ __html: item.text }} />
                                </ListItem>
                              ))}
                            </List>
                          </AccordionPanel>
                        </AccordionItem>
                      )
                    }

                    return <Row key={trophy.trophyId} />
                  })}
                </Accordion>
              </Grid>
            )
          })
        ) : gameTips?.loading ? (
          <Text>Loading Tips...</Text>
        ) : gameTrophies && gameTrophies.completed === gameTrophies.total ? (
          <Text>All trophies earned!</Text>
        ) : gameTrophies ? (
          <Text>Nothing to show! Change filters</Text>
        ) : null}
      </VStack>
    </Container>
  )
})

export default TGameTrophies
