import { BlockedPage } from 'src/app/modules/domain/blocked-page'
import { ActivePage } from 'src/app/modules/domain/blocked-page copy'

export interface AppState {
  activePage: ActivePage | null
  blockedPages: BlockedPage[]
}

export const initialState: AppState = {
  activePage: null,
  blockedPages: [],
}
