import { CheerioAPI, load } from 'cheerio'
import { SearchResult } from '../../model'

function getMinPrice($: CheerioAPI): number | null {
  let minPrice = Infinity
  $('span[data-qa-id="aditem_price"]').each((_, element) => {
    const priceText = $(element).text().trim()
    const price = parseFloat(priceText.replace(/[^\d]/g, ''))
    const priceInt = Math.round(price * 100) //

    if (priceInt < minPrice) {
      minPrice = priceInt
    }
  })
  return minPrice === Infinity ? null : minPrice
}

function getNumberOfResults($: CheerioAPI): number {
  const summaryText = $('h2.text-subhead-expanded').text()
  const regex = /([\d\s\.]+) (annonces|annonce)/
  const match = summaryText.match(regex)

  if (!match || !match[1]) {
    return 0
  }

  const sanitizedMatch = match[1].replace(/\s/g, '').replace(/\./g, '')
  return parseInt(sanitizedMatch, 10)
}

export function parseLeboncoin(html: string): SearchResult | null {
  const $ = load(html)

  const amountOfResults = getNumberOfResults($)

  return {
    platformId: 'leboncoin',
    amountOfResults,
    minPrice: amountOfResults === 0 ? null : getMinPrice($),
  }
}
