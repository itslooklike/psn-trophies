import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { WarningIcon, ExternalLinkIcon, CheckIcon, ChatIcon, TimeIcon, ViewIcon } from '@chakra-ui/icons'
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
  useToast,
} from '@chakra-ui/react'
//
import { useMobxStores } from 'src/store/RootStore'
import type { TTrophiesFilters } from 'src/store/StoreGameTrophies'
import type { TUserTrophyTitle } from 'src/types'
//
import {
  NAME_GAME_NP_PREFIX,
  NAME_TROPHY_HIDDEN,
  NAME_TROPHY_DLC,
  N_TROPHY_FILTER,
  storageSlugs,
} from 'src/utils/config'
import { localStore } from 'src/utils/localStore'
import { fmtStrategeUrl } from 'src/utils/fmt'
import { StarsRow, TrophyRow } from 'src/ui'
import { useTogglers } from 'src/hooks/useTogglers'

const styles = `
  .stratege-content a {
    color: var(--chakra-colors-teal-600);
    transition: all 0.3s;
  }

  .stratege-content a:hover {
    opacity: 0.7;
  }

  .stratege-content img {
    display: inline-block;
    vertical-align: text-bottom;
  }

  .stratege-content .spoiler_control > div > div {
    background-color: inherit !important;
    border-radius: 0 !important;
  }

  .stratege-content .spoiler_control > .smallfont > input {
    white-space: break-spaces;
    color: inherit !important;
    background-color: inherit !important;
    border-radius: 0 !important;
    text-align: left;
  }

  .stratege-content .spoiler_control > .smallfont > right {
    display: none;
  }
`

type TOptionFilter = 'hideOwned' | 'showOwned' | 'default'
type TOptionSorting = `+rate` | `-rate` | 'default'
type TProps = { id: string; game: TUserTrophyTitle }

export const GamePage = observer(({ id, game }: TProps) => {
  const { StoreGameTrophies, StoreStrategeTips } = useMobxStores()
  const [optionSort, optionSortSet] = useState<TOptionSorting>(`+rate`)
  const [optionFilter, optionFilterSet] = useState<TOptionFilter>(localStore(N_TROPHY_FILTER) || `hideOwned`)
  const { showHidden, showHiddenSet, hideDlc, hideDlcSet } = useTogglers()
  const size = useBreakpointValue({ base: `xs`, md: `md` })
  const router = useRouter()
  const toast = useToast()

  const gameTips = StoreStrategeTips.data[id]
  const gameTrophies = StoreGameTrophies.data[id]

  // INFO: нужно выносить отдельно, иначе ругается на реактивный контекст
  const gameName = gameTrophies?.title

  const slug = id && (localStore(NAME_GAME_NP_PREFIX + id) || storageSlugs[id])

  useEffect(() => {
    const init = async () => {
      try {
        if (!gameTrophies) {
          await StoreGameTrophies.fetch(id, { platform: game.trophyTitlePlatform })
          return
        }

        if (slug) {
          // INFO: `slug` - скачиваем по прямой ссылке
          await StoreStrategeTips.fetch(id, { slug })
        } else {
          try {
            // INFO: `name` - нужен для авто-поиска
            await StoreStrategeTips.fetch(id, { name: gameName!, withError: true })
          } catch {
            toast({
              title: `Can't find game automatically 😭`,
              description: (
                <>
                  Try to&nbsp;
                  <Text as={`u`} onClick={handleGoToMatch} cursor={`pointer`}>
                    Sync Manual
                  </Text>
                  &nbsp;or continue without tips
                </>
              ),
              status: `warning`,
              duration: 3_000,
              isClosable: true,
            })
          }
        }
      } catch (error) {
        console.log(`>> GamePage init error`, error)
      }
    }

    init()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameTrophies])

  const handleGoToMatch = () => router.push(`/m/${id}`)

  return (
    <Container maxW={`container.md`}>
      <Head>
        <title>{game.trophyTitleName}</title>
      </Head>
      <VStack spacing={6} mt={6} align={`stretch`}>
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
                <Button disabled rightIcon={<CheckIcon />} size={size} title={`Game was find automatically`}>
                  Auto
                </Button>
                <Button
                  rightIcon={<WarningIcon />}
                  size={size}
                  onClick={handleGoToMatch}
                  title={`If tips show not corrected, try sync manualy`}
                >
                  Sync Manual
                </Button>
              </>
            ) : (
              <IconButton disabled icon={<Spinner size={size} />} aria-label={`loading`} size={size} />
            )}
          </Box>
        </Box>

        <Heading>
          {game.trophyTitleName}
          {` `}
          <Text fontSize={`xs`} color={`teal.600`}>
            {id}
          </Text>
        </Heading>
        <StarsRow game={game} />

        {/* FIXME: убрать дубликаты селектов */}
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
              {gameTips?.data?.hard && (
                <Box fontSize={`xs`} as={`span`} ml={2}>
                  <TimeIcon color={`teal.800`} /> {gameTips.data.hard}
                  <ViewIcon ml={2} color={`teal.800`} /> {gameTips.data.completeRate}
                </Box>
              )}
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

                    // FIXME: сделать методом модели
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
                                  <Code>{item.date}</Code>
                                  <br />
                                  <span
                                    className={`stratege-content`}
                                    dangerouslySetInnerHTML={{ __html: item.text }}
                                  />
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
