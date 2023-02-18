import { switchMap, take } from 'rxjs'
import Browser from 'src/browser/browser'
import Document from 'src/document/document'

// The document body must be hidden before the page is loaded, otherwise the original page is visible for a moment before it is replaced by the block page
Document.hideBody()

Document.setFont('Quicksand', 'assets/fonts/Quicksand-Regular.ttf')

// The body must be replaced after the original document has been loaded otherwise the original page overwrites the block page as soon as it is loaded
Document.contentLoaded
  .pipe(
    take(1),
    switchMap(() => Browser.getFileContent('block-page/block-page.html'))
  )
  .subscribe((pageContent) => {
    Document.replaceBody(pageContent)
    Document.showBody()
  })