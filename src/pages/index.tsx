import { useEffect, useState, useRef, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Cookies from 'js-cookie'
import { Button, Box, Spinner, Container, Checkbox, Text, IconButton, SimpleGrid } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

import {
  NAME_ACCOUNT_ID,
  NAME_UI_HIDDEN,
  NAME_UI_HIDDEN_EARNED,
  NAME_UI_SORT_BY_PROGRESS,
  NAME_UI_SHOW_ONLY_PS4,
} from 'src/utils/constants'
import { GameCard, ProfileCard } from 'src/ui'
import { localStore } from 'src/utils/localStore'
import { useMobxStores } from 'src/store/RootStore'

const Home = observer(() => {
  const { StoreUserTrophies, StoreUserProfile } = useMobxStores()
  const router = useRouter()

  const [hideCompleted, hideCompletedSet] = useState(localStore(NAME_UI_HIDDEN))
  const [hidePlatinumEarned, hidePlatinumEarnedSet] = useState(localStore(NAME_UI_HIDDEN_EARNED))
  const [sortByProgress, sortByProgressSet] = useState(localStore(NAME_UI_SORT_BY_PROGRESS))
  const [onlyPs4, onlyPs4Set] = useState(localStore(NAME_UI_SHOW_ONLY_PS4))

  const buttonRef = useRef(null)

  useEffect(() => {
    const init = async () => {
      if (!StoreUserProfile.data) {
        await StoreUserProfile.fetch()
      }

      if (!StoreUserTrophies.data) {
        await StoreUserTrophies.fetch()
      }
    }

    const userId = Cookies.get(NAME_ACCOUNT_ID)

    if (!userId) {
      router.push(`/login`)
    } else {
      init()
    }
  }, [StoreUserTrophies, router, StoreUserProfile])

  useEffect(() => {
    const uiState = localStore(NAME_UI_HIDDEN)

    if (uiState !== hideCompleted) {
      hideCompletedSet(uiState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMore = useCallback(async () => {
    await StoreUserTrophies.fetchMore()
  }, [StoreUserTrophies])

  useEffect(() => {
    const observer = new IntersectionObserver(
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
      observer.observe(htmlElement)
    }

    return () => {
      if (htmlElement) {
        observer.disconnect()
      }
    }
  }, [StoreUserTrophies.canLoadMore, StoreUserTrophies.loading, handleMore])

  const handleLogout = async () => {
    Cookies.remove(NAME_ACCOUNT_ID)
    try {
      const cacheNames = await caches.keys()
      console.log(`>> cacheNames:`, cacheNames)
      cacheNames.forEach((cacheName) => caches.delete(cacheName))
    } catch (error) {
      console.log(`>> handleLogout error: `, error)
    }

    localStorage.clear()
    location.reload()
  }

  const filters = {
    progress: hideCompleted,
    platinumEarned: hidePlatinumEarned,
    sortByProgress,
    onlyPs4,
  }

  return (
    <Container maxW={`container.xl`} pb={10}>
      <Head>
        <title>Trophy Hunter</title>
      </Head>
      {StoreUserProfile.data && (
        <Box
          d={`flex`}
          justifyContent={`center`}
          alignItems={`start`}
          p={`6`}
          gridGap={`6`}
          flexWrap={`wrap`}
        >
          <ProfileCard user={StoreUserProfile.data} />
          <Box>
            <Box d={`flex`} alignItems={`center`}>
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
            </Box>
            <Box>
              <Checkbox
                onChange={(evt) => {
                  hideCompletedSet(evt.target.checked)
                  localStore.setItem(NAME_UI_HIDDEN, evt.target.checked)
                }}
                isChecked={hideCompleted}
              >
                Hide with 100% progress
              </Checkbox>
            </Box>
            <Box>
              <Checkbox
                onChange={(evt) => {
                  hidePlatinumEarnedSet(evt.target.checked)
                  localStore.setItem(NAME_UI_HIDDEN_EARNED, evt.target.checked)
                }}
                isChecked={hidePlatinumEarned}
              >
                Hide platina earned
              </Checkbox>
            </Box>
            <Box>
              <Checkbox
                onChange={(evt) => {
                  onlyPs4Set(evt.target.checked)
                  localStore.setItem(NAME_UI_SHOW_ONLY_PS4, evt.target.checked)
                }}
                isChecked={onlyPs4}
              >
                Hide not PS4
              </Checkbox>
            </Box>
            <Box>
              <Checkbox
                onChange={(evt) => {
                  sortByProgressSet(evt.target.checked)
                  localStore.setItem(NAME_UI_SORT_BY_PROGRESS, evt.target.checked)
                }}
                isChecked={sortByProgress}
              >
                Sort by progress
              </Checkbox>
            </Box>
          </Box>
        </Box>
      )}

      <SimpleGrid spacing={6} gridTemplateColumns={`repeat(auto-fill, 320px)`} justifyContent={`center`}>
        {StoreUserTrophies.trophies(filters).map((game) => (
          <GameCard key={game.npCommunicationId} game={game} />
        ))}
      </SimpleGrid>

      {StoreUserTrophies.canLoadMore && (
        <Box d={`flex`} justifyContent={`center`} p={`6`} ref={buttonRef}>
          <Button onClick={handleMore} disabled={StoreUserTrophies.loading}>
            {StoreUserTrophies.loading ? <Spinner /> : `Загрузить еще`}
          </Button>
        </Box>
      )}
    </Container>
  )
})

export default Home
