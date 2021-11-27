import React, { useEffect, useState } from 'react'
import Head from 'next/head'
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

import { ISortOptions, GameGlobal } from 'src/store/StoreGameTrophies'
import { useMobxStores } from 'src/store/RootStore'
import {
  NAME_GAME_NP_PREFIX,
  NAME_TROPHY_HIDDEN,
  NAME_TROPHY_DLC,
  NAME_TROPHY_FILTER,
} from 'src/utils/constants'
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

type TTrophiesSorted = {
  all: GameGlobal[]
  default: GameGlobal[]
  dlc: GameGlobal[]
}

const TGameTrophies = observer(() => {
  const { StoreGameTrophies, StoreStrategeTips, StoreUserTrophies, StoreTrophyGroups } = useMobxStores()
  const [options, setOptions] = useState<ISortOptions>({
    sort: `+rate`,
    // FIXME: убрать фильтры в хук
    filter:
      (`window` in globalThis &&
        (window?.localStorage.getItem(NAME_TROPHY_FILTER) as ISortOptions[`filter`])) ||
      `hideOwned`,
  })

  const { showHidden, showHiddenSet, hideDlc, hideDlcSet } = useTogglers()

  const router = useRouter()
  const size = useBreakpointValue({ base: `xs`, md: `md` })

  const id = router.query.id as string

  const handleGoToMatch = () => {
    router.push(`/m/${id}`)
  }

  // FIXME: убрать в хуки
  const slug =
    // @ts-ignore
    id && ((`window` in globalThis && localStorage.getItem(NAME_GAME_NP_PREFIX + id)) || storageSlugs[id])

  useEffect(() => {
    const init = async () => {
      if (id) {
        if (!StoreGameTrophies.data[id]) {
          await StoreGameTrophies.fetch(id)
        }

        if (!StoreTrophyGroups.data[id]) {
          await StoreTrophyGroups.fetch(id)
        }

        if (slug) {
          // `slug` - скачиваем по прямой ссылке
          await StoreStrategeTips.fetch(id, { slug })
        } else {
          // `name` - нужен для автопоиска
          await StoreStrategeTips.fetch(id, { name: StoreTrophyGroups.data[id]!.data.trophyTitleName })
        }
      }
    }

    init()
  }, [StoreTrophyGroups, id, slug, StoreGameTrophies, StoreStrategeTips])

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target
    setOptions((prev) => ({ ...prev, [name]: value }))

    if (name === `filter`) {
      localStorage.setItem(NAME_TROPHY_FILTER, value)
    }
  }

  const trophies = StoreGameTrophies.data[id]?.sort(options).reduce(
    (acc, next) => {
      acc.all.push(next)

      if (next.trophyGroupId === `default`) {
        acc.default.push(next)
      } else {
        acc.dlc.push(next)
      }

      return acc
    },
    { all: [], default: [], dlc: [] } as TTrophiesSorted
  )

  const game = StoreUserTrophies.findById(id)

  return (
    <Container maxW={`container.md`}>
      <Head>
        <title>{game?.trophyTitleName}</title>
      </Head>
      <VStack spacing={`6`} mt={6} align={`stretch`}>
        <Box d={`flex`} alignItems={`center`}>
          <Link onClick={() => router.back()}>👈 Go to Profile</Link>
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
              <Link isExternal href={`https://www.stratege.ru/ps4/games/${slug}/trophies`} d={`flex`}>
                <Button rightIcon={<ExternalLinkIcon />} size={size}>
                  Open in Stratege
                </Button>
              </Link>
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

        {StoreGameTrophies.data[id] && (
          <Box d={`grid`}>
            <Box fontSize={`xs`}>
              Получено: {StoreGameTrophies.data[id]?.completed}
              {` `}
              <Text color={`gray.500`} as={`span`}>
                / {StoreGameTrophies.data[id]?.total}
              </Text>
            </Box>
            <Checkbox
              onChange={(evt) => {
                showHiddenSet(evt.target.checked)
                // FIXME: убрать в хуки
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
                // FIXME: убрать в хуки
                localStorage.setItem(NAME_TROPHY_DLC, JSON.stringify(evt.target.checked))
              }}
              isChecked={hideDlc}
              color={`teal.500`}
              size={`sm`}
            >
              Скрыть DLC ({trophies?.dlc.length})
            </Checkbox>
          </Box>
        )}

        {trophies && trophies.all.length > 0 ? (
          <Grid>
            <style>{styles}</style>
            <Accordion allowToggle>
              {trophies[hideDlc ? `default` : `all`].map((trophy) => {
                const tips = StoreStrategeTips.data[id]?.data
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

                const trophyGroup = StoreTrophyGroups.data[id]?.data.trophyGroups.find(
                  ({ trophyGroupId }) => trophyGroupId === trophy.trophyGroupId
                )

                if (!tips || !tips.length) {
                  return (
                    <TrophyRow
                      trophy={trophy}
                      trophyGroup={trophyGroup}
                      key={trophy.trophyId}
                      showHidden={showHidden}
                    />
                  )
                }

                return (
                  <AccordionItem key={trophy.trophyId}>
                    <AccordionButton p={`4`}>
                      <TrophyRow
                        trophy={trophy}
                        trophyGroup={trophyGroup}
                        tips={tips}
                        showHidden={showHidden}
                      />
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
        ) : StoreStrategeTips.data[id]?.loading ? (
          <Text>Loading...</Text>
        ) : StoreGameTrophies.data[id] &&
          StoreGameTrophies.data[id]?.completed === StoreGameTrophies.data[id]?.total ? (
          <Text>All trophies earned!</Text>
        ) : StoreGameTrophies.data[id] ? (
          <Text>Nothing to show! Change filters</Text>
        ) : null}
      </VStack>
    </Container>
  )
})

export default TGameTrophies
