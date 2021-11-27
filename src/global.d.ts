import 'next'
import { IStore } from 'src/store/RootStore'

declare module 'next' {
  export interface NextPageContext {
    mobxStores: IStore
  }
}
