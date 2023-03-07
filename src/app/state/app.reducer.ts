import { createReducer, on, Action } from '@ngrx/store'
import AppActions from 'src/app/state/app.actions'
import { AppState, initialState } from 'src/app/state/app.state'

export class AppReducer {
  public static readonly featureName = 'app'

  private static readonly reduceInternal = createReducer(
    initialState,

    on(AppActions.activePageChanged, (state, action) => ({
      ...state,
      activePage: action.activePage,
    })),
    on(AppActions.blockedPagesChanged, (state, action) => ({
      ...state,
      blockedPages: action.blockedPages,
    }))
  )

  public static reduce(state: AppState | undefined, action: Action): AppState {
    return AppReducer.reduceInternal(state, action)
  }
}
