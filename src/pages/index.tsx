import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Box } from '@chakra-ui/react'
import StoreUserTrophies from 'src/store/StoreUserTrophies'
import StoreUserProfile from 'src/store/StoreUserProfile'
import { GameCard, ProfileCard } from 'src/ui'
import css from './Home.module.scss'

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
    <div>
      {StoreUserProfile.data && (
        <Box d="flex" justifyContent="center">
          <ProfileCard user={StoreUserProfile.data} avatarUrl={StoreUserProfile.avatarLarge!} />
        </Box>
      )}

      <div className={css.root}>
        {StoreUserTrophies.data?.trophyTitles.map((game) => (
          <GameCard key={game.npCommunicationId} game={game} />
        ))}
      </div>

      {StoreUserTrophies.canLoadMore && (
        <div className={css.buttonContainer}>
          <Button onClick={handleMore}>Загрузить еще</Button>
        </div>
      )}
    </div>
  )
})

export default Home
