import { CheerioAPI, load } from 'cheerio'
import { SearchResult } from '../../model'

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
  const regex = /([\d\.\s]+) Ergebnissen/
  const match = summaryText.match(regex)

  if (!match || !match[1]) {
    return 0
  }

  const sanitizedMatch = match[1].replace(/\./g, '').replace(/\s/g, '')
  return parseInt(sanitizedMatch, 10)
}

export function parseKleinanzeigen(html: string): SearchResult {
  const $ = load(html)

  const amountOfResults = getNumberOfResults($)

  return {
    platformId: 'kleinanzeigen',
    amountOfResults,
    minPrice: amountOfResults === 0 ? null : getMinPrice($),
  }
}
