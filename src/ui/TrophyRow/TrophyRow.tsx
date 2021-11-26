import { StarIcon, ViewIcon } from '@chakra-ui/icons'

import { Box, Image, Text } from '@chakra-ui/react'

import { fmtDate } from 'src/utils/fmtDate'

type TProps = {
  trophy: any
  tips?: any
  hideHidden?: boolean
}

export const TrophyRow = ({ trophy, tips, hideHidden }: TProps) => {
  const props = tips ? {} : { p: 4, borderTopWidth: `1px` }

  return (
    <Box
      filter={hideHidden && trophy.trophyHidden ? `blur(5px)` : undefined}
      d={`flex`}
      gridGap={4}
      flexDirection={[`column`, `row`]}
      alignItems={`center`}
      width={`100%`}
      textAlign={`left`}
      transition={`all 0.3s`}
      {...props}
    >
      <Box flexShrink={0}>
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
      </Box>
      <Box textAlign={`left`} width={`100%`}>
        <Text
          fontWeight={`bold`}
          textTransform={`uppercase`}
          fontSize={`sm`}
          letterSpacing={`wide`}
          lineHeight={1}
          color={`teal.600`}
          d={`flex`}
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
              DLC
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
              <Text
                ml={`auto`}
                as={`span`}
                fontSize={`sm`}
                color={`gray.500`}
                fontWeight={`normal`}
                textTransform={`initial`}
              >
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
