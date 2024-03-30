import { CheerioAPI, load } from 'cheerio'
import { SearchResult } from '../model'

function getMinPrice($: CheerioAPI): number {
  let minPrice = Infinity

  $('tr.dbaListing').each((_, element) => {
    const priceText = $(element).find('.price').text().trim()
    const price = parseInt(priceText.replace(/\D/g, ''), 10)

    if (price < minPrice) {
      minPrice = price
    }
  })

  return minPrice === Infinity ? -1 : minPrice
}

function getNumberOfResults($: CheerioAPI): number | null {
  const text = $('tr.search-result-separator td').text().trim()
  const match = text.match(/\d+/)
  if (!match || !match[0]) {
    return null
  }
  return parseInt(match[0], 10)
}

export function parseDBA(html: string): SearchResult | null {
  const $ = load(html)

  const amountOfResults = getNumberOfResults($)
  if (!amountOfResults || amountOfResults === 0) {
    return null
  }

  return {
    platformId: 'dba',
    amountOfResults,
    minPrice: getMinPrice($),
  }
}
