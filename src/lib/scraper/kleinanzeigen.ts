import { CheerioAPI, load } from 'cheerio'
import { SearchResult } from '../model'

function getMinPrice($: CheerioAPI): number | null {
  const prices = $('.aditem-main--middle--price-shipping--price')
    .map((_, elem) => $(elem).text().trim())
    .get()

  // Filter out "VB" values
  if (prices.includes('Zu verschenken')) {
    return 0
  }

  const filteredPrices = prices.filter((price) => price !== 'VB' || !isNaN(parseInt(price)))
  // Determine the output
  return filteredPrices.length ? parseInt(filteredPrices[0]) * 100 : null
}

function getNumberOfResults($: CheerioAPI): number {
  const summaryText = $('.breadcrump-summary').text()
  const regex = /(\d+) Ergebnissen/
  const match = summaryText.match(regex)
  return match && match[1] ? parseInt(match[1], 10) : 0
}

export function parseEbayKleinanzeigen(html: string): SearchResult {
  const $ = load(html)

  const amountOfResults = getNumberOfResults($)

  return {
    platformId: 'kleinanzeigen',
    amountOfResults,
    minPrice: amountOfResults === 0 ? null : getMinPrice($),
  }
}
