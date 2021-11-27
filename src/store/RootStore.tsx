import React from 'react'
import { enableStaticRendering } from 'mobx-react-lite'
import { configure } from 'mobx'
import { enableLogging } from 'mobx-logger'

import { isServer } from 'src/utils/env'

import { StoreGame } from './StoreGame'
import { StoreSingleGame } from './StoreSingleGame'
import { StoreStrategeGame } from './StoreStrategeGame'
import { StoreUserProfile } from './StoreUserProfile'
import { StoreUserTrophies } from './StoreUserTrophies'

if (isServer) {
  enableStaticRendering(true)
} else {
  configure({
    enforceActions: `always`,
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    // observableRequiresReaction: true,
    // disableErrorBoundaries: true,
  })

  const config = {
    action: true,
    // reaction: true,
    transaction: true,
    compute: true,
  }

  enableLogging(config)
}

export interface IStore {
  StoreGame: StoreGame
  StoreSingleGame: StoreSingleGame
  StoreStrategeGame: StoreStrategeGame
  StoreUserProfile: StoreUserProfile
  StoreUserTrophies: StoreUserTrophies
}

const initialEmpty = {
  StoreGame: {},
  StoreSingleGame: {},
  StoreStrategeGame: {},
  StoreUserProfile: {},
  StoreUserTrophies: {},
}

const createRootStore = (initialData: typeof initialEmpty) =>
  class RootStore implements IStore {
    StoreGame: StoreGame
    StoreSingleGame: StoreSingleGame
    StoreStrategeGame: StoreStrategeGame
    StoreUserProfile: StoreUserProfile
    StoreUserTrophies: StoreUserTrophies

    constructor() {
      this.StoreGame = new StoreGame(initialData.StoreGame)
      this.StoreSingleGame = new StoreSingleGame(initialData.StoreSingleGame)
      this.StoreStrategeGame = new StoreStrategeGame(initialData.StoreStrategeGame)
      this.StoreUserProfile = new StoreUserProfile(initialData.StoreUserProfile)
      this.StoreUserTrophies = new StoreUserTrophies(initialData.StoreUserTrophies)
    }
  }

let clientSideStores: IStore

export function getStores(initialData = initialEmpty) {
  if (isServer) {
    const RootStore = createRootStore(initialData)
    return new RootStore()
  }

  if (!clientSideStores) {
    const RootStore = createRootStore(initialData)
    clientSideStores = new RootStore()
  }

  return clientSideStores
}

export type TInitialStoreData = Parameters<typeof getStores>[0]

// @ts-ignore
const StoreContext = React.createContext<IStore>({})

type TStoreProvider = {
  value: IStore
  children: React.ReactElement
}

export function StoreProvider(props: TStoreProvider) {
  const { value, children } = props
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useMobxStores() {
  return React.useContext(StoreContext)
}
