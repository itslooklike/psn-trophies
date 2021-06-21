import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import StoreUserTrophies from '../store/StoreUserTrophies'

function Home() {
  useEffect(() => {
    StoreUserTrophies.fetch()
  }, [])

  return (
    <div>
      {StoreUserTrophies.data?.trophyTitles.map((game) => (
        <div key={game.npCommunicationId}>
          <Link href={`/g/${game.npCommunicationId}`}>
            <a>{game.trophyTitleName}</a>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default observer(Home)
