import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { filter, map, switchMap, take, withLatestFrom } from 'rxjs'
import { select, Store } from '@ngrx/store'
import DashboardPageActions from 'src/app/modules/dashboard/containers/dashboard-page/state/dashboard-page.actions'
import Browser from 'src/app/modules/infrastructure/browser/browser'
import BlockedPageRepository from 'src/app/modules/infrastructure/repositories/blocked-page.repository'
import { BlockedPage } from 'src/app/modules/domain/blocked-page'
import AppSelectors from 'src/app/state/app.selectors'
import InfrastructureActions from 'src/app/modules/infrastructure/state/infrastructure.actions'

@Injectable()
export class DashboardPageEffects {
  blockCurrentPageRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardPageActions.blockCurrentPageRequested),
      switchMap((action) =>
        this.browser.activeTab.pipe(
          take(1),
          withLatestFrom(this.store.pipe(select(AppSelectors.blockedPages))),
          filter(([tab, blockedPages]) => tab.url != null && !blockedPages.some((blockedPage) => blockedPage.matches(tab.url!))),
          switchMap(([tab]) =>
            this.blockedPageRepository
              .addBlockedPage(new BlockedPage(tab.url!), action.blockAcrossInstallations)
              .pipe(map(() => InfrastructureActions.reloadTabRequested({ tab })))
          )
        )
      )
    )
  )

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly browser: Browser,
    private readonly blockedPageRepository: BlockedPageRepository
  ) {}
}
