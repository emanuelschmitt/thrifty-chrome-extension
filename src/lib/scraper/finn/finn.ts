import { CheerioAPI, load } from 'cheerio'
import { SearchResult } from '../../model'

function getMinPrice($: CheerioAPI): number | null {
  let minPrice = Infinity
  $('.sf-search-ad > div:contains("kr")').each((index, element) => {
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
  const sectionHtml = $('#page-results div[aria-live="polite"]').html()

  if (!sectionHtml) {
    return 0
  }

  const regex = /(\d+)/g
  const match = sectionHtml.match(regex)

  if (!match || !match[0]) {
    return 0
  }

  return parseInt(match[0], 10)
}

export function parseFinn(html: string): SearchResult | null {
  const $ = load(html)

  const amountOfResults = getNumberOfResults($)

  return {
    platformId: 'finn',
    amountOfResults,
    minPrice: amountOfResults === 0 ? null : getMinPrice($),
  }
}
