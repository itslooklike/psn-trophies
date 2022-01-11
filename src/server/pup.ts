import puppeteer from 'puppeteer'
import scrapeIt from 'scrape-it'

const userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0`

class Prerender {
  browser: puppeteer.Browser | null = null
  page: puppeteer.Page | null = null

  async init() {
    this.browser = await puppeteer.launch({
      // headless: false,
      args: [`--no-sandbox`, `--window-size=1920,1080`],
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    })

    this.page = await this.browser.newPage()

    await this.page.setUserAgent(userAgent)
    await this.page.setRequestInterception(true)

    this.page.on(`request`, (req) => {
      if (
        req.resourceType() == `stylesheet` ||
        req.resourceType() == `font` ||
        req.resourceType() == `image`
      ) {
        req.abort()
      } else {
        req.continue()
      }
    })
  }

  async scrap(url: string, scheme: scrapeIt.ScrapeOptions, selector?: string) {
    if (!this.page) {
      await this.init()
    }

    try {
      await this.page!.goto(url, { waitUntil: `networkidle2` })

      if (selector) {
        await this.page!.waitForSelector(selector)
      }
    } catch {}

    const html = await this.page!.content()

    const data = scrapeIt.scrapeHTML(html, scheme)

    return data
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
      this.page = null
      return
    }
  }
}

export default new Prerender()
