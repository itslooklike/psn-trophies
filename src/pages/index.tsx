import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Box, Spinner, Container } from '@chakra-ui/react'
import StoreUserTrophies from 'src/store/StoreUserTrophies'
import StoreUserProfile from 'src/store/StoreUserProfile'
import { GameCard, ProfileCard } from 'src/ui'

const Home = observer(() => {
  useEffect(() => {
    const init = async () => {
      await StoreUserProfile.fetch()
      await StoreUserTrophies.fetch()
    }

    init()
  }, [])

  const handleMore = () => StoreUserTrophies.fetchMore()

  return (
    <Container maxW="container.xl">
      {StoreUserProfile.data && (
        <Box d="flex" justifyContent="center" p="6">
          <ProfileCard user={StoreUserProfile.data} avatarUrl={StoreUserProfile.avatarLarge!} />
        </Box>
      )}

      <Box d="flex" flexWrap="wrap" gridGap="6" justifyContent="center">
        {StoreUserTrophies.data?.trophyTitles.map((game) => (
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
