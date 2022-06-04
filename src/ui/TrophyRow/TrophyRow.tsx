import { StarIcon, ViewIcon, CheckIcon } from '@chakra-ui/icons'
import { Box, Image, Text } from '@chakra-ui/react'

import { fmtDate } from 'src/utils/fmt'
import type { TTrophyGroup, TUserTrophyWithAdd, TTip } from 'src/types'

type TProps = {
  trophy: TUserTrophyWithAdd
  tips?: TTip[]
  showHidden?: boolean
  trophyGroup?: TTrophyGroup
}

export const TrophyRow = (props: TProps) => {
  const { trophy, tips, showHidden, trophyGroup } = props

  const other = tips ? {} : { p: 4, borderTopWidth: `1px` }

  return (
    <Box
      filter={!showHidden && trophy.trophyHidden ? `blur(5px)` : undefined}
      display={`flex`}
      gridGap={4}
      flexDirection={[`column`, `row`]}
      alignItems={[`flex-start`, `center`]}
      width={`100%`}
      textAlign={`left`}
      transition={`all 0.3s`}
      {...other}
    >
      <Box flexShrink={0} position={`relative`}>
        <Image
          width={`100px`}
          height={`100px`}
          borderRadius={`lg`}
          src={trophy.trophyIconUrl}
          alt={trophy.trophyName}
          loading={`lazy`}
          objectFit={`cover`}
          ignoreFallback
        />
        {trophy.earned && (
          <Box position={`absolute`} top={1} left={-5}>
            <CheckIcon color={`green.500`}></CheckIcon>
          </Box>
        )}
      </Box>
      <Box textAlign={`left`} width={`100%`}>
        <Text
          fontWeight={`bold`}
          textTransform={`uppercase`}
          fontSize={`sm`}
          letterSpacing={`wide`}
          lineHeight={1}
          color={`teal.600`}
          display={`flex`}
          alignItems={`center`}
          title={trophy.trophyType}
        >
          <StarIcon
            mr={`1`}
            color={
              trophy.trophyType === `platinum`
                ? `blue.300`
                : trophy.trophyType === `gold`
                ? `yellow.300`
                : trophy.trophyType === `silver`
                ? `gray.300`
                : `orange.700`
            }
          />
          {trophy.trophyEarnedRate}%
          {trophy.trophyGroupId !== `default` && (
            <Text as={`span`} ml={1} fontSize={`xs`} color={`gray.500`}>
              DLC ({trophyGroup?.trophyGroupName} {trophyGroup?.trophyGroupId})
            </Text>
          )}
          {trophy.trophyHidden && <ViewIcon ml={`1`} />}
          {trophy.earnedDateTime && (
            <Text as={`span`} ml={2} fontSize={`xs`} color={`gray.500`}>
              {fmtDate(trophy.earnedDateTime)}
            </Text>
          )}
          {!!(tips && tips.length) && (
            <>
              &nbsp;
              <Text ml={`auto`} as={`span`} fontSize={`sm`} color={`gray.500`} fontWeight={`normal`} textTransform={`initial`}>
                ({tips.length}) tips
              </Text>
            </>
          )}
        </Text>
        <Text mt={1} display={`block`} fontSize={`lg`} lineHeight={`normal`} fontWeight={`semibold`}>
          {trophy.trophyName}
        </Text>
        <Text color={`gray.500`}>{trophy.trophyDetail}</Text>
      </Box>
    </Box>
  )
}
