import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { observer } from 'mobx-react-lite'
import cx from 'classnames'
import StoreGame, { ISortOptions } from 'src/store/StoreGame'
import css from './GameTrophies.module.scss'

// https://stackoverflow.com/questions/61040790/userouter-withrouter-receive-undefined-on-query-in-first-render

const GameTrophies = observer(() => {
  const [options, setOptions] = useState<ISortOptions>({ sort: 'default', filter: 'default' })

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

  return (
    <div>
      <h1>
        <Link href="/">
          <a>Home</a>
        </Link>
      </h1>
      <div>
        <select name="sort" value={options.sort} onChange={handleSelect}>
          <option value="-rate">сначала самые редкие</option>
          <option value="+rate">сначала самые популярные</option>
          <option value="default">без сортировки</option>
        </select>
        <select name="filter" value={options.filter} onChange={handleSelect}>
          <option value="showOwned">показать полученные</option>
          <option value="hideOwned">скрыть полученные</option>
          <option value="default">без фильтра</option>
        </select>
      </div>
      <div className={css.root}>
        {StoreGame.data[id]?.sort(options).map((trophy) => (
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

export default GameTrophies
