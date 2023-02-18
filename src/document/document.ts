import { fromEventPattern, Observable } from 'rxjs'
import Browser from 'src/browser/browser'

export default class Document {
  public static get contentLoaded(): Observable<void> {
    return this.fromDocumentEvent('DOMContentLoaded')
  }

  public static addFont(name: string, fontPath: string): void {
    Document.addStyle(`@font-face { font-family: ${name}; src: url("${Browser.getUrl(fontPath)}"); }`)
  }

  public static hideBody(): void {
    Document.addStyle('body {visibility: hidden !important;}')
  }

  public static showBody(): void {
    Document.addStyle('body {visibility: visible !important;}')
  }

  public static replaceBody(body: string): void {
    document.body.outerHTML = body
  }

  public static setFont(name: string, fontPath: string): void {
    Document.addFont(name, fontPath)
    Document.addStyle(`body {font-family: ${name}  !important}`)
  }

  private static addStyle(styleContent: string): void {
    const style = document.documentElement.appendChild(document.createElement('style'))
    style.textContent = styleContent
  }

  static fromDocumentEvent(event: string): Observable<void> {
    return fromEventPattern<void>(
      (handler) => {
        document.addEventListener(event, handler)
      },
      (handler) => {
        document.removeEventListener(event, handler)
      }
    )
  }
}
