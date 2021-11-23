import { useEffect, useState, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Button, Box, Spinner, Container, Checkbox, Text, IconButton, SimpleGrid } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

import StoreUserTrophies from 'src/store/StoreUserTrophies'
import StoreUserProfile from 'src/store/StoreUserProfile'
import { NAME_ACCOUNT_ID } from 'src/utils/constants'
import { NAME_UI_HIDDEN } from 'src/utils/constants'
import { GameCard, ProfileCard } from 'src/ui'
import { getUiState } from 'src/utils/getUiState'

const Home = observer(() => {
  const router = useRouter()

  const [hideCompleted, hideCompletedSet] = useState(getUiState(NAME_UI_HIDDEN))

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
  }, [])

  useEffect(() => {
    const uiState = getUiState(NAME_UI_HIDDEN)
    if (uiState !== hideCompleted) {
      hideCompletedSet(uiState)
    }
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
        rootMargin: `0px`,
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
  }, [StoreUserTrophies.canLoadMore])

  const handleMore = async () => {
    await StoreUserTrophies.fetchMore()
  }

  const handleLogout = () => {
    Cookies.remove(NAME_ACCOUNT_ID)
    localStorage.clear()
    location.reload()
  }

  return (
    <Container maxW={`container.xl`} pb={10}>
      {StoreUserProfile.data && (
        <Box d={`flex`} justifyContent={`center`} alignItems={`start`} p={`6`} gridGap={`6`} flexWrap={`wrap`}>
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
            <Checkbox
              onChange={(evt) => {
                hideCompletedSet(evt.target.checked)
                localStorage.setItem(NAME_UI_HIDDEN, JSON.stringify(evt.target.checked))
              }}
              isChecked={hideCompleted}
            >
              Hide completed
            </Checkbox>
          </Box>
        </Box>
      )}

      <SimpleGrid spacing={6} gridTemplateColumns={`repeat(auto-fill, 320px)`} justifyContent={`center`}>
        {StoreUserTrophies.trophies(hideCompleted).map((game) => (
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
