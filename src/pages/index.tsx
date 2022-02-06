import { useEffect, useState, useRef, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Cookies from 'js-cookie'
import { Button, Box, Spinner, Container, Checkbox, Text, IconButton, SimpleGrid } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
//
import { useMobxStores } from 'src/store/RootStore'
//
import {
  NAME_ACCOUNT_ID,
  NAME_UI_HIDDEN,
  NAME_UI_HIDDEN_EARNED,
  NAME_UI_SORT_BY_PROGRESS,
  NAME_UI_SHOW_ONLY_PS4,
} from 'src/utils/config'
import { GameCard, ProfileCard } from 'src/ui'
import { localStore } from 'src/utils/localStore'

const Home = observer(() => {
  const { StoreUserTrophies, StoreUserProfile } = useMobxStores()
  const router = useRouter()

  const [progress, hideCompletedSet] = useState(localStore(NAME_UI_HIDDEN))
  const [platinumEarned, hidePlatinumEarnedSet] = useState(localStore(NAME_UI_HIDDEN_EARNED))
  const [sortByProgress, sortByProgressSet] = useState(localStore(NAME_UI_SORT_BY_PROGRESS))
  const [onlyPs4, onlyPs4Set] = useState(localStore(NAME_UI_SHOW_ONLY_PS4))

  const buttonRef = useRef(null)

  const handleLogout = async () => {
    // TODO: работу с куками -> в отдельный сервис
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
        console.log(`index page`, error)
      }
    }

    const userId = Cookies.get(NAME_ACCOUNT_ID)

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
      hideCompletedSet(uiState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const filters = [
    {
      text: `Hide with 100% progress`,
      onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
        hideCompletedSet(evt.target.checked)
        localStore.setItem(NAME_UI_HIDDEN, evt.target.checked)
      },
      isChecked: progress,
    },
    {
      text: `Hide platina earned`,
      onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
        hidePlatinumEarnedSet(evt.target.checked)
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
