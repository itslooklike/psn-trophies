import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'

import { useMobxStores } from 'src/store/RootStore'

import { GamePage } from 'src/comps/pages/GamePage'

const PageGame = observer(() => {
  const { StoreUserTrophies } = useMobxStores()
  const router = useRouter()
  const id = router.query.id as string
  const game = StoreUserTrophies.findById(id)

  useEffect(() => {
    if (!game) {
      router.replace(`/`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return game ? <GamePage id={id} game={game} /> : null
})

export default PageGame
