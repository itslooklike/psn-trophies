import { useEffect, useState, useRef, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import Head from 'next/head'
import JSCookies from 'js-cookie'
import { Button, Box, Spinner, Container, Checkbox, Text, IconButton, SimpleGrid, useColorMode } from '@chakra-ui/react'
import { DeleteIcon, MoonIcon } from '@chakra-ui/icons'

import { useMobxStores } from 'src/store/RootStore'
import { GameCard, ProfileCard } from 'src/ui'
import { localStore } from 'src/utils/localStore'
import {
  NAME_ACCOUNT_ID,
  NAME_UI_HIDDEN,
  NAME_UI_HIDDEN_EARNED,
  NAME_UI_SORT_BY_PROGRESS,
  NAME_UI_SHOW_ONLY_PS4,
} from 'src/utils/config'

const Home = observer(() => {
  const { StoreUserTrophies, StoreUserProfile } = useMobxStores()
  const { toggleColorMode } = useColorMode()
  const router = useRouter()

  const [sortByProgress, sortByProgressSet] = useState(localStore(NAME_UI_SORT_BY_PROGRESS))
  const [platinumEarned, platinumEarnedSet] = useState(localStore(NAME_UI_HIDDEN_EARNED))
  const [onlyPs4, onlyPs4Set] = useState(localStore(NAME_UI_SHOW_ONLY_PS4))
  const [progress, progressSet] = useState(localStore(NAME_UI_HIDDEN))

  const buttonRef = useRef(null)

  const handleLogout = async () => {
    // TODO: работу с куками -> в отдельный сервис
    JSCookies.remove(NAME_ACCOUNT_ID)

    try {
      const cacheNames = await caches.keys()
      console.log(`>> cacheNames:`, cacheNames)
      cacheNames.forEach((cacheName) => caches.delete(cacheName))
    } catch (error) {
      console.log(`>> handleLogout error: `, error)
    }

    localStore.clear()
    location.reload()
  }

  const handleMore = useCallback(async () => {
    await StoreUserTrophies.fetchMore()
  }, [StoreUserTrophies])

  useEffect(() => {
    const init = async () => {
      try {
        if (!StoreUserProfile.data) {
          await StoreUserProfile.fetch()
        }

        if (!StoreUserTrophies.data) {
          await StoreUserTrophies.fetch()
        }
      } catch (error) {
        console.log(`>> index page`, error)
      }
    }

    const { user_id } = router.query as { user_id?: string }

    if (user_id) {
      JSCookies.set(NAME_ACCOUNT_ID, user_id)
    }

    const userId = user_id || JSCookies.get(NAME_ACCOUNT_ID)

    if (!userId) {
      router.push(`/login`)
    } else {
      init()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const uiState = localStore(NAME_UI_HIDDEN)

    if (uiState !== progress) {
      progressSet(uiState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const watcher = new IntersectionObserver(
      (entities) => {
        if (entities[0].isIntersecting && !StoreUserTrophies.loading && StoreUserTrophies.canLoadMore) {
          handleMore()
        }
      },
      {
        root: null,
        rootMargin: `0px 0px 500px 0px`,
        threshold: 1.0,
      }
    )

    const htmlElement = buttonRef.current

    if (htmlElement) {
      watcher.observe(htmlElement)
    }

    return () => {
      if (htmlElement) {
        watcher.disconnect()
      }
    }
  }, [StoreUserTrophies.canLoadMore, StoreUserTrophies.loading, handleMore])

  const filters = [
    {
      text: `Hide with 100% progress`,
      onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
        progressSet(evt.target.checked)
        localStore.setItem(NAME_UI_HIDDEN, evt.target.checked)
      },
      isChecked: progress,
    },
    {
      text: `Hide with platina earned`,
      onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
        platinumEarnedSet(evt.target.checked)
        localStore.setItem(NAME_UI_HIDDEN_EARNED, evt.target.checked)
      },
      isChecked: platinumEarned,
    },
    {
      text: `Hide not PS4`,
      onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
        onlyPs4Set(evt.target.checked)
        localStore.setItem(NAME_UI_SHOW_ONLY_PS4, evt.target.checked)
      },
      isChecked: onlyPs4,
    },
    {
      text: `Sort by progress`,
      onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
        sortByProgressSet(evt.target.checked)
        localStore.setItem(NAME_UI_SORT_BY_PROGRESS, evt.target.checked)
      },
      isChecked: sortByProgress,
    },
  ]

  const filtersMap = {
    progress,
    platinumEarned,
    onlyPs4,
    sortByProgress,
  }

  return (
    <Container maxW={`container.xl`} pb={10}>
      <Head>
        <title>Trophy Hunter</title>
      </Head>
      {StoreUserProfile.data && (
        <Box display={`flex`} justifyContent={`center`} alignItems={`start`} p={`6`} gridGap={`6`} flexWrap={`wrap`}>
          <ProfileCard user={StoreUserProfile.data} />
          <Box>
            <Box display={`flex`} alignItems={`center`}>
              <Text fontSize={`xl`} fontWeight={`bold`} textTransform={`uppercase`}>
                Settings
              </Text>
              <IconButton
                ml={1}
                variant={`outline`}
                size={`sm`}
                onClick={handleLogout}
                aria-label={`Reset user`}
                icon={<DeleteIcon />}
              />
              <IconButton
                ml={1}
                variant={`outline`}
                size={`sm`}
                onClick={toggleColorMode}
                aria-label={`Change color theme`}
                icon={<MoonIcon />}
              />
            </Box>
            {filters.map((filter, index) => (
              <Box key={index}>
                <Checkbox onChange={filter.onChange} isChecked={filter.isChecked}>
                  {filter.text}
                </Checkbox>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <SimpleGrid spacing={6} gridTemplateColumns={`repeat(auto-fill, 320px)`} justifyContent={`center`}>
        {StoreUserTrophies.trophies(filtersMap).map((game) => (
          <GameCard key={game.npCommunicationId} game={game} />
        ))}
      </SimpleGrid>

      {StoreUserTrophies.canLoadMore && (
        <Box display={`flex`} justifyContent={`center`} p={`6`} ref={buttonRef}>
          <Button onClick={handleMore} disabled={StoreUserTrophies.loading}>
            {StoreUserTrophies.loading ? <Spinner /> : `Загрузить еще`}
          </Button>
        </Box>
      )}
    </Container>
  )
})

export default Home
