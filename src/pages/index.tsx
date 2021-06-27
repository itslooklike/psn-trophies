import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Heading, Box, Progress, Image, Badge } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import StoreUserTrophies from 'src/store/StoreUserTrophies'
import StoreUserProfile from 'src/store/StoreUserProfile'
import { GameCard } from 'src/ui'
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
          <Box d="flex" borderWidth="1px" borderRadius="lg" alignItems="center" pl="2">
            <Image
              boxSize="100px"
              src={StoreUserProfile.avatarLarge}
              alt="User Avatar"
              objectFit="cover"
              ignoreFallback
            />
            <Box p="4">
              <Heading>
                {StoreUserProfile.data.profile.onlineId}{' '}
                <Badge borderRadius="full" px="2" colorScheme="teal">
                  {StoreUserProfile.trophySummary!.level}
                </Badge>
              </Heading>

              <Box d="flex" mt="2" alignItems="center">
                <Box d="flex" alignItems="center">
                  <StarIcon color="blue.300" />
                  <Box as="span" ml="2" color="gray.600" fontSize="sm">
                    {StoreUserProfile.earnedTrophies!.platinum}
                  </Box>
                </Box>
                <Box d="flex" ml="3" alignItems="center">
                  <StarIcon color="yellow.300" />
                  <Box as="span" ml="2" color="gray.600" fontSize="sm">
                    {StoreUserProfile.earnedTrophies!.gold}
                  </Box>
                </Box>
                <Box d="flex" ml="3" alignItems="center">
                  <StarIcon color="gray.300" />
                  <Box as="span" ml="2" color="gray.600" fontSize="sm">
                    {StoreUserProfile.earnedTrophies!.silver}
                  </Box>
                </Box>
                <Box d="flex" ml="3" alignItems="center">
                  <StarIcon color="orange.300" />
                  <Box as="span" ml="2" color="gray.600" fontSize="sm">
                    {StoreUserProfile.earnedTrophies!.bronze}
                  </Box>
                </Box>
              </Box>
              <Progress mt="2" size="xs" value={StoreUserProfile.trophySummary!.progress} />
            </Box>
          </Box>
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
