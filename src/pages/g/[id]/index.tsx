import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useMobxStores } from 'src/store/RootStore'
import { GamePage } from 'src/comps/pages/GamePage'

const PageGame = observer(() => {
  const { StoreUserTrophies } = useMobxStores()

  const router = useRouter()

  const id = router.query.id as string

  if (!id) {
    router.replace(`/`)
    return null
  }

  const game = StoreUserTrophies.findById(id)

  if (!game) {
    router.replace(`/`)
    return null
  }

  return <GamePage id={id} game={game} />
})

export default PageGame
