import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import StoreUserTrophies from 'src/store/StoreUserTrophies'
import StoreUserProfile from 'src/store/StoreUserProfile'
import { GameCard } from 'src/ui'
import css from './Home.module.scss'

const Home = observer(() => {
  useEffect(() => {
    const init = async () => {
      await StoreUserProfile.fetch()
      await StoreUserTrophies.fetch()
    }

    init()
  }, [])

  const handleMore = () => StoreUserTrophies.fetchMore()

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

      {StoreUserTrophies.canLoadMore && (
        <div className={css.buttonContainer}>
          <button type="button" onClick={handleMore}>
            Загрузить еще
          </button>
        </div>
      )}
    </div>
  )
})

export default Home
