import NextLink from 'next/link'
import { Box, Image, Badge, Progress, LinkBox, LinkOverlay, Stack } from '@chakra-ui/react'

import type { TUserTrophyTitle } from 'src/types'
import { StarsRow } from 'src/ui'

interface IProps {
  game: TUserTrophyTitle
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
        <NextLink href={`/g/${game.npCommunicationId}`} passHref>
          <LinkOverlay>{game.trophyTitleName}</LinkOverlay>
        </NextLink>
      </Box>

      <Box p={3}>
        <StarsRow game={game} />
      </Box>

      <Progress size={`xs`} value={game.progress} />
    </LinkBox>
  )
}
