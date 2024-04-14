import { CheerioAPI, load } from 'cheerio'
import { SearchResult } from '../../model'

function getMinPrice($: CheerioAPI): number | null {
  let minPrice = Infinity
  $('.hz-text-price-label').each((index, element) => {
    const priceText = $(element).text().trim()
    const price = parseFloat(
      priceText
        .replace(/[^\d,.]/g, '')
        .replace(',', '.')
        .replace('.', ''),
    ) // Replace commas with dots and remove other non-numeric characters
    const priceInt = Math.round(price) // Convert to integer (e.g., € 0,20 -> 20, € 270 -> 27000, € 390 -> 39000)

    if (priceInt < minPrice) {
      minPrice = priceInt
    }
  })

  return minPrice === Infinity ? null : minPrice
}

function getNumberOfResults($: CheerioAPI): number {
  const summaryText = $('li[data-testid="breadcrumb-last-item"] > span').text()

  const regex = /([\d\.\s]+) resu/
  const match = summaryText.match(regex)

  if (!match || !match[1]) {
    return 0
  }

  const sanitizedMatch = match[1].replace(/\./g, '').replace(/\s/g, '')
  return match && match[1] ? parseInt(sanitizedMatch) : 0
}

export function parseMarktplaats(html: string): SearchResult | null {
  const $ = load(html)

  const amountOfResults = getNumberOfResults($)

  return {
    platformId: 'marktplaats',
    amountOfResults,
    minPrice: amountOfResults === 0 ? null : getMinPrice($),
  }
}
