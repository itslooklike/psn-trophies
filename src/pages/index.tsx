import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Button, Box, Spinner, Container, Checkbox, Text, IconButton } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'

import StoreUserTrophies from 'src/store/StoreUserTrophies'
import StoreUserProfile from 'src/store/StoreUserProfile'
import { NAME_ACCOUNT_ID } from 'src/utils/constants'
import { NAME_UI_HIDDEN } from 'src/utils/constants'
import { GameCard, ProfileCard } from 'src/ui'

const Home = observer(() => {
  const router = useRouter()

  const [hideCompleted, hideCompletedSet] = useState(false)

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
      router.push('/login')
    } else {
      init()
    }
  }, [])

  useEffect(() => {
    const initial = localStorage.getItem(NAME_UI_HIDDEN)

    if (initial !== null) {
      const result = initial ? JSON.parse(initial) : false
      hideCompletedSet(result)
    }
  }, [])

  const handleMore = async () => {
    await StoreUserTrophies.fetchMore()
  }

  const handleLogout = () => {
    localStorage.clear()
    Cookies.remove(NAME_ACCOUNT_ID)

    // FIXME: тут нужно вычищать все сторы, ну или полностью перезагружать страницу...
    location.reload()
  }

  return (
    <Container maxW="container.xl">
      {StoreUserProfile.data && (
        <Box d="flex" justifyContent="center" alignItems="start" p="6" gridGap="6" flexWrap="wrap">
          <ProfileCard user={StoreUserProfile.data} />
          <Box>
            <Text fontSize="xl" fontWeight="bold" textTransform="uppercase">
              Settings{' '}
              <IconButton
                variant="outline"
                size="sm"
                onClick={handleLogout}
                aria-label="Reset user"
                icon={<DeleteIcon />}
              />
            </Text>
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

      <Box d="flex" flexWrap="wrap" gridGap="6" justifyContent="center">
        {StoreUserTrophies.trophies(hideCompleted).map((game) => (
          <GameCard key={game.npCommunicationId} game={game} />
        ))}
      </Box>

      {StoreUserTrophies.canLoadMore && (
        <Box d="flex" justifyContent="center" p="6">
          <Button onClick={handleMore} disabled={StoreUserTrophies.loading}>
            {StoreUserTrophies.loading ? <Spinner /> : 'Загрузить еще'}
          </Button>
        </Box>
      )}
    </Container>
  )
})

export default Home
