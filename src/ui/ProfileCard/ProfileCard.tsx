import { Box, Image, Badge, Heading, Progress, Text } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import type { IUser } from 'src/store/StoreUserProfile'

interface IProps {
  user: IUser
}

export const ProfileCard = (props: IProps) => {
  const { user } = props

  return (
    <Box
      display={`flex`}
      borderWidth={`1px`}
      borderRadius={`lg`}
      alignItems={`center`}
      pl={`2`}
      boxShadow={`md`}
      flexWrap={`wrap`}
      justifyContent={`center`}
    >
      <Image
        boxSize={`100px`}
        src={user.profile.avatars.find(({ size }) => size === `xl`)?.url}
        alt={`User Avatar`}
        objectFit={`cover`}
        ignoreFallback
        loading={`lazy`}
      />
      <Box p={`4`}>
        <Heading>
          {user.profile.onlineId}
          {user.profile.isPlus && <StarIcon ml={1} w={4} h={4} color={`teal.500`} />}
        </Heading>
        <Badge borderRadius={`full`} px={2} colorScheme={`teal`}>
          Level: {user.trophySummary.trophyLevel}
        </Badge>
        <Box display={`flex`} mt={`2`} alignItems={`center`}>
          <Box display={`flex`} alignItems={`center`}>
            <StarIcon color={`blue.300`} />
            <Box as={`span`} ml={`2`} color={`teal.500`} fontSize={`sm`}>
              {user.trophySummary.earnedTrophies.platinum}
            </Box>
          </Box>
          <Box display={`flex`} ml={`3`} alignItems={`center`}>
            <StarIcon color={`yellow.300`} />
            <Box as={`span`} ml={`2`} color={`teal.500`} fontSize={`sm`}>
              {user.trophySummary.earnedTrophies.gold}
            </Box>
          </Box>
          <Box display={`flex`} ml={`3`} alignItems={`center`}>
            <StarIcon color={`gray.300`} />
            <Box as={`span`} ml={`2`} color={`teal.500`} fontSize={`sm`}>
              {user.trophySummary.earnedTrophies.silver}
            </Box>
          </Box>
          <Box display={`flex`} ml={`3`} alignItems={`center`}>
            <StarIcon color={`orange.300`} />
            <Box as={`span`} ml={`2`} color={`teal.500`} fontSize={`sm`}>
              {user.trophySummary.earnedTrophies.bronze}
            </Box>
          </Box>
          <Text ml={`5`} color={`blue.500`} fontWeight={`bold`}>
            {user.trophySummary.progress}%
          </Text>
        </Box>
        <Progress mt={`2`} size={`xs`} value={user.trophySummary.progress} width={`100%`} />
      </Box>
    </Box>
  )
}
