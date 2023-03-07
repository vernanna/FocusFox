import { createAction, props } from '@ngrx/store'
import { BlockedPage } from 'src/app/modules/domain/blocked-page'
import { ActivePage } from 'src/app/modules/domain/blocked-page copy'

export default class AppActions {
  private static readonly group = '[App]'

  public static readonly initializing = createAction(`${AppActions.group} Initializing`)

  public static readonly loadBlockedPages = createAction(`${AppActions.group} Load blocked pages`)
  public static readonly blockedPagesChanged = createAction(
    `${AppActions.group} Blocked pages changed`,
    props<{ blockedPages: BlockedPage[] }>()
  )

  public static readonly loadActivePage = createAction(`${AppActions.group} Load active page`)
  public static readonly activePageChanged = createAction(
    `${AppActions.group} Active page changed`,
    props<{ activePage: ActivePage | null }>()
  )
}
