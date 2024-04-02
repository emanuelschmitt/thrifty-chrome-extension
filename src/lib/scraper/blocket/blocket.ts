import { CheerioAPI, load } from 'cheerio'
import { SearchResult } from '../../model'

function getMinPrice($: CheerioAPI): number | null {
  let minPrice = Infinity
  $('div[class^="Price__StyledPrice"]').each((index, element) => {
    const priceText = $(element).text().trim()
    const price = parseFloat(
      priceText
        .replace(/[^\d,.]/g, '')
        .replace(',', '.')
        .replace('.', ''),
    )
    const priceInt = Math.round(price)

    if (priceInt < minPrice) {
      minPrice = priceInt
    }
  })

  return minPrice === Infinity ? null : minPrice
}

function getNumberOfResults($: CheerioAPI): number {
  const summaryText = $('div[data-cy="search-result-count"]').text()
  const regex = /([\d\s\.]+) ann/
  const match = summaryText.match(regex)

  if (!match || !match[1]) {
    return 0
  }

  const sanitizedMatch = match[1].replace(/\s/g, '').replace(/\./g, '')
  return parseInt(sanitizedMatch, 10)
}

export function parseBlocket(html: string): SearchResult | null {
  const $ = load(html)

  const amountOfResults = getNumberOfResults($)

  return {
    platformId: 'blocket',
    amountOfResults,
    minPrice: amountOfResults === 0 ? null : getMinPrice($),
  }
}
