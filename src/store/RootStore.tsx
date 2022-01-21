import React from 'react'
import { enableStaticRendering } from 'mobx-react-lite'
import { configure } from 'mobx'
// import { enableLogging } from 'mobx-logger'

import { isServer } from 'src/utils/config'

import { StoreGameTrophies } from './StoreGameTrophies'
import { StoreStrategeTips } from './StoreStrategeTips'
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

  if (process.env.NODE_ENV !== `production`) {
    // const config = {
    //   action: true,
    //   // reaction: true,
    //   transaction: true,
    //   compute: true,
    // }
    // enableLogging(config)
  }
}

export interface IStore {
  StoreGameTrophies: StoreGameTrophies
  StoreStrategeTips: StoreStrategeTips
  StoreUserProfile: StoreUserProfile
  StoreUserTrophies: StoreUserTrophies
}

const initialEmpty = {
  StoreGameTrophies: {},
  StoreStrategeTips: {},
  StoreUserProfile: {},
  StoreUserTrophies: {},
}

const createRootStore = (initialData: typeof initialEmpty) =>
  class RootStore implements IStore {
    StoreGameTrophies: StoreGameTrophies
    StoreStrategeTips: StoreStrategeTips
    StoreUserProfile: StoreUserProfile
    StoreUserTrophies: StoreUserTrophies

    constructor() {
      this.StoreGameTrophies = new StoreGameTrophies(initialData.StoreGameTrophies)
      this.StoreStrategeTips = new StoreStrategeTips(initialData.StoreStrategeTips)
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
