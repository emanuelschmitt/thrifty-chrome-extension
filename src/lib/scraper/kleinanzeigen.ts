import { CheerioAPI, load } from 'cheerio'
import { SearchResult } from '../model'

function getMinPrice($: CheerioAPI): number {
  const prices = $('.aditem-main--middle--price-shipping--price')
    .map((_, elem) => $(elem).text().trim())
    .get()

  // Filter out "VB" values
  if (prices.includes('Zu verschenken')) {
    return 0
  }
  const filteredPrices = prices.filter((price) => price !== 'VB' || !isNaN(parseInt(price)))
  // Determine the output
  return filteredPrices.length ? parseInt(filteredPrices[0]) * 100 : -1
}

function getNumberOfResults($: CheerioAPI): number | null {
  const summaryText = $('.breadcrump-summary').text()
  const regex = /(\d+) Ergebnissen/
  const match = summaryText.match(regex)
  return match && match[1] ? parseInt(match[1], 10) : null
}

export function parseEbayKleinanzeigen(html: string): SearchResult | null {
  const $ = load(html)

  const amountOfResults = getNumberOfResults($)
  if (!amountOfResults || amountOfResults === 0) {
    return null
  }

  return {
    platformId: 'kleinanzeigen',
    amountOfResults,
    minPrice: getMinPrice($),
  }
}
