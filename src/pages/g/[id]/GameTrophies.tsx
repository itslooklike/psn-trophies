import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import cx from 'classnames'
import StoreGame, { ISortOptions } from '../../../store/StoreGame'
import css from './GameTrophies.module.scss'

// https://stackoverflow.com/questions/61040790/userouter-withrouter-receive-undefined-on-query-in-first-render

export const GameTrophies = observer(() => {
  const [options, setOptions] = useState<ISortOptions>({ sort: 'default', filterHidden: false })

  const { query } = useRouter()
  const id = query.id as string | undefined

  useEffect(() => {
    if (id) StoreGame.fetch(id)
  }, [id])

  if (!id) return null

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target
    setOptions((prev) => ({ ...prev, [name]: value }))
  }

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target
    setOptions((prev) => ({ ...prev, [name]: checked }))
  }

  return (
    <div>
      <div>
        <select name="sort" value={options.sort} onChange={handleSelect}>
          <option value="-rate">сначала самые редкие</option>
          <option value="+rate">сначала самые популярные</option>
          <option value="default">без сортировки</option>
        </select>
        <label>
          <input
            name="filterHidden"
            type="checkbox"
            checked={options.filterHidden}
            onChange={handleInput}
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
})
