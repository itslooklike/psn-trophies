import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import StoreUserTrophies from '../store/StoreUserTrophies'
import { GameCard } from '../ui'
import css from './Home.module.scss'

export const Home = observer(() => {
  useEffect(() => {
    StoreUserTrophies.fetch()
  }, [])

  return (
    <div className={css.root}>
      {StoreUserTrophies.data?.trophyTitles.map((game) => (
        <GameCard key={game.npCommunicationId} game={game} />
      ))}
    </div>
  )
})
