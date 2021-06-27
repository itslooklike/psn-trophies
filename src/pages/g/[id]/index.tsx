import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { observer } from 'mobx-react-lite'
import { Box, Grid, Image, Text, Link, Heading, Select } from '@chakra-ui/react'
import StoreGame, { ISortOptions } from 'src/store/StoreGame'

// https://stackoverflow.com/questions/61040790/userouter-withrouter-receive-undefined-on-query-in-first-render

const GameTrophies = observer(() => {
  const [options, setOptions] = useState<ISortOptions>({ sort: 'default', filter: 'default' })

  const { query } = useRouter()

  const id = query.id as string | undefined

  useEffect(() => {
    if (id) {
      StoreGame.fetch(id)
    }
  }, [id])

  if (!id) {
    return null
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target

    setOptions((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Box p="6">
      <Heading>
        <NextLink href="/">
          <Link> 👈 Go to Profile</Link>
        </NextLink>
      </Heading>
      <Box d="flex" mt="6">
        <Box>
          <Select name="sort" value={options.sort} onChange={handleSelect}>
            <option value="-rate">сначала самые редкие</option>
            <option value="+rate">сначала самые популярные</option>
            <option value="default">без сортировки</option>
          </Select>
        </Box>
        <Box ml="6">
          <Select name="filter" value={options.filter} onChange={handleSelect}>
            <option value="showOwned">показать полученные</option>
            <option value="hideOwned">скрыть полученные</option>
            <option value="default">без фильтра</option>
          </Select>
        </Box>
      </Box>
      <Grid gap="6" mt="6">
        {StoreGame.data[id]?.sort(options).map((trophy) => (
          <Box
            key={trophy.trophyId}
            d="flex"
            alignItems="center"
            borderWidth="1px"
            borderRadius="lg"
          >
            <Image
              borderRadius="lg"
              boxSize="80px"
              objectFit="cover"
              src={trophy.trophyIconUrl}
              alt={trophy.trophyName}
              loading="lazy"
            />
            <Box ml="6">
              <Text fontSize="md" fontWeight="bold">
                {trophy.trophyName}
              </Text>
              <Text fontSize="sm">{trophy.trophyDetail}</Text>
              <Text fontSize="xs">{trophy.trophyEarnedRate}%</Text>
            </Box>
          </Box>
        ))}
      </Grid>
    </Box>
  )
})

export default GameTrophies
