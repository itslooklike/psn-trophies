import Link from 'next/link'
import type { IUserGame } from 'src/store/StoreUserTrophies'
import css from './GameCard.module.scss'

interface IProps {
  game: IUserGame
}

export const GameCard = ({ game }: IProps) => {
  return (
    <div className={css.root}>
      <img
        className={css.img}
        height="150"
        width="300"
        src={game.trophyTitleIconUrl}
        alt={game.trophyTitleName}
        loading="lazy"
      />
      <div className={css.content}>
        <Link href={`/g/${game.npCommunicationId}`}>
          <a className={css.title}>{game.trophyTitleName}</a>
        </Link>
        <div className={css.platform}>{game.trophyTitlePlatfrom}</div>
        <div className={css.progressContainer}>
          <div
            className={css.progressInner}
            style={{ width: `${game.comparedUser.progress}%` }}
          ></div>
        </div>
        <div className={css.priceContainer}>
          <div>{game.comparedUser.earnedTrophies.platinum}</div>
          <div>{game.comparedUser.earnedTrophies.gold}</div>
          <div>{game.comparedUser.earnedTrophies.silver}</div>
          <div>{game.comparedUser.earnedTrophies.bronze}</div>
        </div>
      </div>
    </div>
  )
}
