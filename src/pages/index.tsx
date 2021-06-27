import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Box } from '@chakra-ui/react'
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
    <Box>
      {StoreUserProfile.data && (
        <Box d="flex" justifyContent="center">
          <ProfileCard user={StoreUserProfile.data} avatarUrl={StoreUserProfile.avatarLarge!} />
        </Box>
      )}

      <Box>
        {StoreUserTrophies.data?.trophyTitles.map((game) => (
          <GameCard key={game.npCommunicationId} game={game} />
        ))}
      </Box>

      {StoreUserTrophies.canLoadMore && (
        <Box>
          <Button onClick={handleMore}>Загрузить еще</Button>
        </Box>
      )}
    </Box>
  )
})

export default Home
