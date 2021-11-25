import 'next'
import { IStore } from './store/RootStore'

// eslint-disable-next-line quotes
declare module 'next' {
  export interface NextPageContext {
    mobxStores: IStore
  }
}
