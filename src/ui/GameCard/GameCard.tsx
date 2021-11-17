import NextLink from 'next/link'
import { Box, Image, Badge, Progress, LinkBox, LinkOverlay } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import type { IUserGame } from 'src/store/StoreUserTrophies'

interface IProps {
  game: IUserGame
}

export const GameCard = (props: IProps) => {
  const {
    game,
    game: { definedTrophies, earnedTrophies },
  } = props

  return (
    <LinkBox maxW="xs" minW="xs" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md">
      <Image
        src={game.trophyTitleIconUrl}
        alt={game.trophyTitleName}
        objectFit="cover"
        ignoreFallback
        height="175px"
        width="100%"
        loading="lazy"
      />

      <Box p="3">
        <Box d="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            {game.trophyTitlePlatfrom}
          </Badge>
        </Box>

        <Box mt="1" fontWeight="semibold" isTruncated>
          <NextLink href={`/g/${game.npCommunicationId}?name=${game.trophyTitleName}`} passHref>
            <LinkOverlay>{game.trophyTitleName}</LinkOverlay>
          </NextLink>
        </Box>

        <Box d="flex" mt="2" alignItems="center">
          <Box d="flex" alignItems="center">
            <StarIcon color="blue.300" />
            <Box as="span" ml="2" color="teal.500" fontSize="sm">
              {earnedTrophies.platinum}
            </Box>
          </Box>
          <Box d="flex" ml="3" alignItems="center">
            <StarIcon color="yellow.300" />
            <Box as="span" ml="2" color="teal.500" fontSize="sm">
              {earnedTrophies.gold}
            </Box>
            {definedTrophies.gold !== earnedTrophies.gold && (
              <Box as="span" ml="1" color="teal.700" fontSize="sm">
                ({definedTrophies.gold})
              </Box>
            )}
          </Box>
          <Box d="flex" ml="3" alignItems="center">
            <StarIcon color="gray.300" />
            <Box as="span" ml="2" color="teal.500" fontSize="sm">
              {earnedTrophies.silver}
            </Box>
            {definedTrophies.silver !== earnedTrophies.silver && (
              <Box as="span" ml="1" color="teal.700" fontSize="sm">
                ({definedTrophies.silver})
              </Box>
            )}
          </Box>
          <Box d="flex" ml="3" alignItems="center">
            <StarIcon color="orange.700" />
            <Box as="span" ml="2" color="teal.500" fontSize="sm">
              {earnedTrophies.bronze}
            </Box>
            {definedTrophies.bronze !== earnedTrophies.bronze && (
              <Box as="span" ml="1" color="teal.700" fontSize="sm">
                ({definedTrophies.bronze})
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Progress size="xs" value={game.progress} />
    </LinkBox>
  )
}
