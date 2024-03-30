import { CheerioAPI, load } from 'cheerio'
import { SearchResult } from '../model'

function getMinPrice($: CheerioAPI): number {
  let minPrice = Infinity
  $('span[data-testid^="search-result-entry-price-"]').each((index, element) => {
    const priceText = $(element).text().trim()
    const price = parseInt(priceText.replace(/\D/g, ''), 10)

    if (price < minPrice) {
      minPrice = price
    }
  })

  return minPrice === Infinity ? -1 : minPrice
}

function getNumberOfResults($: CheerioAPI): number | null {
  const summaryText = $('#result-list-title').text()
  const regex = /(\d+) Anzeigen/
  const match = summaryText.match(regex)

  return match && match[1] ? parseInt(match[1], 10) : null
}

export function parseWillhaben(html: string): SearchResult | null {
  const $ = load(html)

  const amountOfResults = getNumberOfResults($)
  if (!amountOfResults || amountOfResults === 0) {
    return null
  }

  return {
    platformId: 'willhaben',
    amountOfResults,
    minPrice: getMinPrice($),
  }
}
