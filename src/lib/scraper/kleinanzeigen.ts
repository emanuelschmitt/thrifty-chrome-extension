import { load } from 'cheerio'
import { SearchResult } from '../model'

export function parseEbayKleinanzeigen(html: string): SearchResult | null {
  const $ = load(html)
  const summaryText = $('.breadcrump-summary').text()
  const regex = /(\d+) Ergebnissen/
  const match = summaryText.match(regex)

  if (match && match[1]) {
    const numberOfResults = parseInt(match[1], 10)

    const prices = $('.aditem-main--middle--price-shipping--price')
      .map((_, elem) => $(elem).text().trim())
      .get()

    // Filter out "VB" values
    const actualPrices = prices.filter((price) => price !== 'VB')

    // Determine the output
    const outputPrice = actualPrices.length ? parseInt(actualPrices[0]) : -1

    return {
      platformId: 'kleinanzeigen',
      amountOfResults: numberOfResults,
      minPrice: outputPrice,
    }
  } else {
    return null
  }
}
