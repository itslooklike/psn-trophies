import 'next'
import { IStore } from './store/RootStore'

declare module 'next' {
  export interface NextPageContext {
    mobxStores: IStore
  }
}
