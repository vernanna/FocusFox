import { Injectable } from '@angular/core'
import {
  concatWith,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  ignoreElements,
  map,
  mergeMap,
  Observable,
  startWith,
  switchMap,
  take,
} from 'rxjs'
import { from } from 'rxjs'
import ContentScript from 'src/app/modules/content-scripts/content-script'
import { ActivePage } from 'src/app/modules/domain/blocked-page copy'
import Tab from 'src/app/modules/infrastructure/browser/entities/tab'
import ActionClicked from 'src/app/modules/infrastructure/browser/events/action-clicked'
import fromChromeEvent from 'src/app/modules/infrastructure/browser/events/from-chrome-event'
import Installed from 'src/app/modules/infrastructure/browser/events/installed'
import TabLoading from 'src/app/modules/infrastructure/browser/events/tab-loading'

@Injectable()
export default class Browser {
  public get onInstall(): Observable<Installed> {
    return fromChromeEvent(chrome.runtime.onInstalled).pipe(map(() => new Installed()))
  }

  public get actionClicked(): Observable<ActionClicked> {
    return fromChromeEvent(chrome.action.onClicked).pipe(
      filter(([tab]) => tab.id != undefined),
      map(([tab]) => new ActionClicked(new Tab(tab.id as number, tab.url ?? null)))
    )
  }

  public get tabLoading(): Observable<TabLoading> {
    return fromChromeEvent(chrome.tabs.onUpdated).pipe(
      filter(([, tabChangeInfo]) => tabChangeInfo.status === 'loading'),
      map(([tabId, , tab]) => new TabLoading(new Tab(tabId, tab.url ?? null)))
    )
  }

  public getFileContent(path: string): Observable<string> {
    return from(fetch(this.getUrl(path)).then((response) => response.text()))
  }

  public getUrl(path: string): URL {
    return new URL(chrome.runtime.getURL(path))
  }

  public executeContentScriptInActiveTab(contentScript: ContentScript): Observable<void> {
    return this.activeTab.pipe(
      take(1),
      switchMap((tab) => this.executeScript(tab.id, contentScript.scriptUrls))
    )
  }

  public executeContentScript(tab: Tab, contentScript: ContentScript): Observable<void> {
    return this.executeScript(tab.id, contentScript.scriptUrls)
  }

  public executeScript(tabId: number, files: string[]): Observable<void> {
    return from(
      chrome.scripting.executeScript({
        target: {
          tabId: tabId,
        },
        injectImmediately: true,
        files: files,
      })
    ).pipe(ignoreElements())
  }

  public get activePage(): Observable<ActivePage> {
    return this.activeTab.pipe(
      switchMap((activeTab) =>
        fromChromeEvent(chrome.tabs.onUpdated).pipe(
          filter(([, , tab]) => tab.id === activeTab.id),
          map(([, , tab]) => new Tab(tab.id!, tab.url ?? null)),
          startWith(activeTab)
        )
      ),
      filter((tab) => tab.url != null),
      map((tab) => new ActivePage(tab.url!)),
      distinctUntilChanged((previous, active) => previous.matches(active.url))
    )
  }

  public get activeTab(): Observable<Tab> {
    return from(chrome.tabs.query({ active: true, currentWindow: true })).pipe(
      mergeMap((tabs) => tabs),
      filter((tab) => tab.id != undefined),
      map((tab) => tab.id!),
      take(1),
      concatWith(fromChromeEvent(chrome.tabs.onActivated).pipe(map(([tabActiveInfo]) => tabActiveInfo.tabId))),
      mergeMap((tabId) => from(chrome.tabs.get(tabId))),
      filter((tab) => tab.id != undefined),
      map((tab) => new Tab(tab.id!, tab.url ?? null))
    )
  }

  public reloadTab(tab: Tab): Observable<void> {
    return from(chrome.tabs.reload(tab.id))
  }
}
