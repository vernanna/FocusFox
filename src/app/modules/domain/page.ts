export abstract class Page {
  constructor(public readonly url: URL) {}

  public matches(url: URL): boolean {
    return url.host == this.url.host
  }
}
