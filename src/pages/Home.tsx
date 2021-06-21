import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import StoreUserTrophies from '../store/StoreUserTrophies'
import StoreUserProfile from '../store/StoreUserProfile'
import { GameCard } from '../ui'
import css from './Home.module.scss'

export const Home = observer(() => {
  useEffect(() => {
    const init = async () => {
      await StoreUserProfile.fetch()
      await StoreUserTrophies.fetch()
    }

    init()
  }, [])

  return (
    <div>
      {StoreUserProfile.data && (
        <div>
          <h1>{StoreUserProfile.data.profile.onlineId}</h1>
          <div>Level: {StoreUserProfile.data.profile.trophySummary.level}</div>
          <img
            src={
              StoreUserProfile.data.profile.avatarUrls.find((avatar) => avatar.size === 'l')
                ?.avatarUrl
            }
            alt="User Avatar"
          />
        </div>
      )}
      <div className={css.root}>
        {StoreUserTrophies.data?.trophyTitles.map((game) => (
          <GameCard key={game.npCommunicationId} game={game} />
        ))}
      </div>
    </div>
  )
})
