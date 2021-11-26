import { Box, Text } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import type { IUserGame } from 'src/store/StoreUserTrophies'

interface IProps {
  game: IUserGame
}

export const StarsRow = (props: IProps) => {
  const {
    game,
    game: { definedTrophies, earnedTrophies },
  } = props

  return (
    <Box d={`flex`} alignItems={`center`}>
      {definedTrophies.platinum > 0 && (
        <Box d={`flex`} alignItems={`center`}>
          <StarIcon color={`blue.300`} />
          <Text as={`span`} ml={`2`} color={`teal.500`} fontSize={`sm`}>
            {earnedTrophies.platinum}
          </Text>
        </Box>
      )}
      <Box d={`flex`} ml={`3`} alignItems={`center`}>
        <StarIcon color={`yellow.300`} />
        <Box d={`flex`} alignItems={`baseline`}>
          <Text as={`span`} ml={`2`} color={`teal.500`} fontSize={`sm`}>
            {earnedTrophies.gold}
          </Text>
          {definedTrophies.gold !== earnedTrophies.gold && (
            <Text as={`span`} color={`teal.900`} fontSize={`xs`}>
              ({definedTrophies.gold})
            </Text>
          )}
        </Box>
      </Box>
      <Box d={`flex`} ml={`3`} alignItems={`center`}>
        <StarIcon color={`gray.300`} />
        <Box d={`flex`} alignItems={`baseline`}>
          <Text as={`span`} ml={`2`} color={`teal.500`} fontSize={`sm`}>
            {earnedTrophies.silver}
          </Text>
          {definedTrophies.silver !== earnedTrophies.silver && (
            <Text as={`span`} color={`teal.900`} fontSize={`xs`}>
              ({definedTrophies.silver})
            </Text>
          )}
        </Box>
      </Box>
      <Box d={`flex`} ml={`3`} alignItems={`center`}>
        <StarIcon color={`orange.700`} />
        <Box d={`flex`} alignItems={`baseline`}>
          <Text as={`span`} ml={`2`} color={`teal.500`} fontSize={`sm`}>
            {earnedTrophies.bronze}
          </Text>
          {definedTrophies.bronze !== earnedTrophies.bronze && (
            <Text as={`span`} color={`teal.900`} fontSize={`xs`}>
              ({definedTrophies.bronze})
            </Text>
          )}
        </Box>
      </Box>
      <Text ml={`auto`} fontSize={`xs`} color={`gray.700`}>
        {game.trophyTitlePlatform}
      </Text>
    </Box>
  )
}