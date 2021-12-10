import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
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

import { useMobxStores } from 'src/store/RootStore'
import type { TTrophiesFilters } from 'src/store/StoreGameTrophies'
import {
  NAME_GAME_NP_PREFIX,
  NAME_TROPHY_HIDDEN,
  NAME_TROPHY_DLC,
  NAME_TROPHY_FILTER,
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
`

type TOptionFilter = 'hideOwned' | 'showOwned' | 'default'
type TOptionSorting = `+rate` | `-rate` | 'default'

const TGameTrophies = observer(() => {
  const { StoreGameTrophies, StoreStrategeTips, StoreUserTrophies } = useMobxStores()
  const [optionSort, optionSortSet] = useState<TOptionSorting>(`+rate`)
  const [optionFilter, optionFilterSet] = useState<TOptionFilter>(
    localStore(NAME_TROPHY_FILTER) || `hideOwned`
  )

  const { showHidden, showHiddenSet, hideDlc, hideDlcSet } = useTogglers()

  const router = useRouter()
  const size = useBreakpointValue({ base: `xs`, md: `md` })

  const id = router.query.id as string

  const handleGoToMatch = () => {
    router.push(`/m/${id}`)
  }

  const slug = id && (localStore(NAME_GAME_NP_PREFIX + id) || storageSlugs[id])

  useEffect(() => {
    const init = async () => {
      if (id) {
        if (!StoreGameTrophies.data[id]) {
          await StoreGameTrophies.fetch(id)
        }

        if (slug) {
          // `slug` - скачиваем по прямой ссылке
          await StoreStrategeTips.fetch(id, { slug })
        } else {
          // `name` - нужен для автопоиска
          await StoreStrategeTips.fetch(id, {
            name: StoreGameTrophies.data[id]!.data.trophyTitleName,
          })
        }
      }
    }

    init()
  }, [id, slug, StoreGameTrophies, StoreStrategeTips])

  const mainData = StoreGameTrophies.data[id]

  const game = StoreUserTrophies.findById(id)

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
            {StoreStrategeTips.data[id]?.loading ? (
              <Button disabled rightIcon={<Spinner size={size} />} size={size}>
                Loading
              </Button>
            ) : StoreStrategeTips.data[id]?.error ? (
              <Button rightIcon={<WarningIcon />} onClick={handleGoToMatch} size={size}>
                Manual
              </Button>
            ) : StoreStrategeTips.data[id]?.data && slug ? (
              <>
                <Button rightIcon={<WarningIcon />} onClick={handleGoToMatch} size={size}>
                  Manual
                </Button>
                <Link isExternal href={fmtStrategeUrl(slug)} d={`flex`}>
                  <Button rightIcon={<ExternalLinkIcon />} size={size}>
                    Open in Stratege
                  </Button>
                </Link>
              </>
            ) : StoreStrategeTips.data[id]?.data ? (
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
                localStore.setItem(NAME_TROPHY_FILTER, event.target.value)
              }}
            >
              <option value={`showOwned`}>Полученные</option>
              <option value={`hideOwned`}>Не полученные</option>
              <option value={`default`}>Все</option>
            </Select>
          </Box>
        </SimpleGrid>

        {mainData && (
          <Box d={`grid`}>
            <Box fontSize={`xs`}>
              Получено: {mainData.completed}
              {` `}
              <Text color={`gray.500`} as={`span`}>
                / {mainData.total}
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
            {mainData ? (
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
                Скрыть DLC ({mainData.dlcAmount})
              </Checkbox>
            ) : null}
          </Box>
        )}

        {mainData && mainData.data.trophies.length > 0 ? (
          mainData.trophyGroups({ hideDlc }).map((trophyGroup) => {
            let filters: TTrophiesFilters = {}

            if (optionFilter && optionFilter !== `default`) {
              filters[optionFilter] = true
            }

            if (optionSort && optionSort !== `default`) {
              filters.sorting = optionSort
            }

            const trophies = mainData.trophyGroupsById(trophyGroup.trophyGroupId, filters)

            return (
              <Grid key={trophyGroup.trophyGroupId}>
                <style>{styles}</style>
                {trophyGroup.trophyGroupId !== `default` && (
                  <Heading mb={5}>DLC: {trophyGroup.trophyGroupName}</Heading>
                )}
                <Accordion allowToggle>
                  {trophies.map((trophy) => {
                    const tips = StoreStrategeTips.tips(id, trophy)

                    const trophyGroup = mainData.data.trophyGroups.find(
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
                            <UnorderedList>
                              {tips.map((item, key) => (
                                <ListItem
                                  key={key}
                                  dangerouslySetInnerHTML={{ __html: item.text }}
                                  mt={`5`}
                                />
                              ))}
                            </UnorderedList>
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
        ) : StoreStrategeTips.data[id]?.loading ? (
          <Text>Loading...</Text>
        ) : mainData && mainData.completed === mainData.total ? (
          <Text>All trophies earned!</Text>
        ) : mainData ? (
          <Text>Nothing to show! Change filters</Text>
        ) : null}
      </VStack>
    </Container>
  )
})

export default TGameTrophies
