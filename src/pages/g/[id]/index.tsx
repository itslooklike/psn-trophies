import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import cx from 'classnames'
import StoreGame, { ISortOptions } from '../../../store/StoreGame'
import css from './GameTrophies.module.scss'

// https://stackoverflow.com/questions/61040790/userouter-withrouter-receive-undefined-on-query-in-first-render

function GameTrophies() {
  const router = useRouter()
  const id = router.query.id as string | undefined

  const [sort, setSort] = useState<ISortOptions['sort'] | undefined>()
  const [hide, setHide] = useState(false)

  useEffect(() => {
    if (id) {
      StoreGame.fetch(id)
    }
  }, [id])

  if (!id) {
    return null
  }

  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setSort(value as ISortOptions['sort'])
  }

  const options = {
    sort: sort,
    filterHidden: hide,
  }

  return (
    <div>
      <div>
        <select value={sort} onChange={handleSort}>
          <option value="-rate">сначала самые редкие</option>
          <option value="+rate">сначала самые популярные</option>
          <option>без сортировки</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={hide}
            onChange={(event) => setHide(event.target.checked)}
          />
          скрыть полученные
        </label>
      </div>
      <div className={css.root}>
        {StoreGame.sort(id, options)?.map((trophy) => (
          <div
            key={trophy.trophyId}
            className={cx(css.card, !trophy.comparedUser.earned && css.no)}
          >
            <img
              width="80"
              height="80"
              className={css.img}
              src={trophy.trophyIconUrl}
              alt={trophy.trophyName}
              loading="lazy"
            />
            <div>
              <div className={css.title}>{trophy.trophyName}</div>
              <div className={css.subtitle}>{trophy.trophyDetail}</div>
              <div className={css.rare}>{trophy.trophyEarnedRate}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default observer(GameTrophies)
