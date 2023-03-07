import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-page-info',
  templateUrl: './page-info.component.html',
})
export class PageInfoComponent {
  @Input() public activePageIsBlocked!: boolean

  @Output() public blockCurrentPageRequested = new EventEmitter<{ blockAcrossInstallations: boolean }>()
}
