import NextLink from 'next/link'
import { Box, Image, Badge, Progress, LinkBox, LinkOverlay, Text, Stack } from '@chakra-ui/react'
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

  const is100Progress = game.progress === 100
  const isNoPlatinum = definedTrophies.platinum === 0
  const isPlatinumEarned = earnedTrophies.platinum > 0

  const isHaveBadge = is100Progress || isNoPlatinum || isPlatinumEarned

  return (
    <LinkBox
      maxW={`xs`}
      minW={`xs`}
      borderWidth={`1px`}
      borderRadius={`lg`}
      overflow={`hidden`}
      boxShadow={`md`}
      position={`relative`}
      d={`flex`}
      flexDirection={`column`}
    >
      {isHaveBadge && (
        <Stack direction={`row`} position={`absolute`} top={`2`} right={`2`}>
          {isNoPlatinum && <Badge variant={`solid`}>No platinum</Badge>}
          {is100Progress && <Badge variant={`solid`}>100%</Badge>}
          {isPlatinumEarned && <Badge variant={`solid`}>Platinum</Badge>}
        </Stack>
      )}

      <Image
        src={game.trophyTitleIconUrl}
        alt={game.trophyTitleName}
        objectFit={`cover`}
        ignoreFallback
        height={`175px`}
        width={`100%`}
        loading={`lazy`}
      />

      <Box mt={`1`} fontWeight={`semibold`} noOfLines={2} mb={`auto`} pl={3} pr={3}>
        <NextLink href={`/g/${game.npCommunicationId}?name=${game.trophyTitleName}`} passHref>
          <LinkOverlay>{game.trophyTitleName}</LinkOverlay>
        </NextLink>
      </Box>

      <Box d={`flex`} p={3} alignItems={`center`}>
        {definedTrophies.platinum > 0 && (
          <Box d={`flex`} alignItems={`center`}>
            <StarIcon color={`blue.300`} />
            <Box as={`span`} ml={`2`} color={`teal.500`} fontSize={`sm`}>
              {earnedTrophies.platinum}
            </Box>
          </Box>
        )}
        <Box d={`flex`} ml={`3`} alignItems={`center`}>
          <StarIcon color={`yellow.300`} />
          <Box as={`span`} ml={`2`} color={`teal.500`} fontSize={`sm`}>
            {earnedTrophies.gold}
          </Box>
          {definedTrophies.gold !== earnedTrophies.gold && (
            <Box as={`span`} color={`teal.900`} fontSize={`xs`}>
              ({definedTrophies.gold})
            </Box>
          )}
        </Box>
        <Box d={`flex`} ml={`3`} alignItems={`center`}>
          <StarIcon color={`gray.300`} />
          <Box as={`span`} ml={`2`} color={`teal.500`} fontSize={`sm`}>
            {earnedTrophies.silver}
          </Box>
          {definedTrophies.silver !== earnedTrophies.silver && (
            <Box as={`span`} color={`teal.900`} fontSize={`xs`}>
              ({definedTrophies.silver})
            </Box>
          )}
        </Box>
        <Box d={`flex`} ml={`3`} alignItems={`center`}>
          <StarIcon color={`orange.700`} />
          <Box as={`span`} ml={`2`} color={`teal.500`} fontSize={`sm`}>
            {earnedTrophies.bronze}
          </Box>
          {definedTrophies.bronze !== earnedTrophies.bronze && (
            <Box as={`span`} color={`teal.900`} fontSize={`xs`}>
              ({definedTrophies.bronze})
            </Box>
          )}
        </Box>
        <Text ml={`auto`} fontSize={`xs`} color={`gray.700`}>
          {game.trophyTitlePlatform}
        </Text>
      </Box>

      <Progress size={`xs`} value={game.progress} />
    </LinkBox>
  )
}
