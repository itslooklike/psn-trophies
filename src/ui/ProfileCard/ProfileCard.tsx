import { Box, Image, Badge, Heading, Progress, Text } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import type { IUserProfile } from 'src/store/StoreUserProfile'

interface IProps {
  user: IUserProfile
  avatarUrl: string
}

export const ProfileCard = (props: IProps) => {
  const { user, avatarUrl } = props
  return (
    <Box d="flex" borderWidth="1px" borderRadius="lg" alignItems="center" pl="2">
      <Image boxSize="100px" src={avatarUrl} alt="User Avatar" objectFit="cover" ignoreFallback />
      <Box p="4">
        <Heading>
          {user.profile.onlineId}{' '}
          <Badge borderRadius="full" px="2" colorScheme="teal">
            {user.profile.trophySummary.level}
          </Badge>
        </Heading>

        <Box d="flex" mt="2" alignItems="center">
          <Box d="flex" alignItems="center">
            <StarIcon color="blue.300" />
            <Box as="span" ml="2" color="gray.600" fontSize="sm">
              {user.profile.trophySummary.earnedTrophies.platinum}
            </Box>
          </Box>
          <Box d="flex" ml="3" alignItems="center">
            <StarIcon color="yellow.300" />
            <Box as="span" ml="2" color="gray.600" fontSize="sm">
              {user.profile.trophySummary.earnedTrophies.gold}
            </Box>
          </Box>
          <Box d="flex" ml="3" alignItems="center">
            <StarIcon color="gray.300" />
            <Box as="span" ml="2" color="gray.600" fontSize="sm">
              {user.profile.trophySummary.earnedTrophies.silver}
            </Box>
          </Box>
          <Box d="flex" ml="3" alignItems="center">
            <StarIcon color="orange.300" />
            <Box as="span" ml="2" color="gray.600" fontSize="sm">
              {user.profile.trophySummary.earnedTrophies.bronze}
            </Box>
          </Box>
          <Text ml="5" color="blue.500" fontWeight="bold">
            {user.profile.trophySummary.progress}%
          </Text>
        </Box>
        <Progress mt="2" size="xs" value={user.profile.trophySummary.progress} />
      </Box>
    </Box>
  )
}
