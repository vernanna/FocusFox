import { Component, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import DashboardPageActions from 'src/app/modules/dashboard/containers/dashboard-page/state/dashboard-page.actions'
import AppSelectors from 'src/app/state/app.selectors'

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.container.component.html',
})
export class DashboardPageContainerComponent implements OnInit {
  public activePageIsBlocked$!: Observable<boolean>

  constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.activePageIsBlocked$ = this.store.pipe(select(AppSelectors.activePageIsBlocked))
  }

  public onBlockCurrentPageRequested(event: { blockAcrossInstallations: boolean }): void {
    this.store.dispatch(DashboardPageActions.blockCurrentPageRequested(event))
  }
}
