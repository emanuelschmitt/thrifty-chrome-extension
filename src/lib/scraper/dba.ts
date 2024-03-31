import { CheerioAPI, load } from 'cheerio'
import { SearchResult } from '../model'

function getMinPrice($: CheerioAPI): number | null {
  let minPrice = Infinity

  $('tr.dbaListing').each((_, element) => {
    const priceText = $(element).find('.price').text().trim()
    const price = parseInt(priceText.replace(/\D/g, ''), 10)

    if (price < minPrice) {
      minPrice = price
    }
  })

  return minPrice === Infinity ? null : minPrice
}

function getNumberOfResults($: CheerioAPI): number {
  const text = $('tr.search-result-separator td').text().trim()
  const match = text.match(/\d+/)
  if (!match || !match[0]) {
    return 0
  }
  return parseInt(match[0], 10)
}

export function parseDBA(html: string): SearchResult | null {
  const $ = load(html)

  const amountOfResults = getNumberOfResults($)

  return {
    platformId: 'dba',
    amountOfResults,
    minPrice: amountOfResults === 0 ? null : getMinPrice($),
  }
}
