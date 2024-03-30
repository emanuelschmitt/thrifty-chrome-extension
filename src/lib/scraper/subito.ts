import { CheerioAPI, load } from 'cheerio'
import { SearchResult } from '../model'

function getMinPrice($: CheerioAPI): number | null {
  let prices: number[] = []

  $('div[class^="index-module_price"]').each((index, element) => {
    const priceText = $(element).text().trim()
    const price = parseFloat(
      priceText
        .replace(/[^\d,.]/g, '')
        .replace(',', '.')
        .replace('.', ''),
    ) // Replace commas with dots and remove other non-numeric characters
    const priceInt = Math.round(price * 100) // Convert to integer (e.g., € 0,20 -> 20, € 270 -> 27000, € 390 -> 39000)
    prices.push(priceInt)
  })

  if (prices.length === 0) {
    return null
  }

  return Math.min(...prices)
}

function getNumberOfResults($: CheerioAPI): number | null {
  const summaryText = $('.listing-heading > p').text()
  const regex = /(\d+) risul/
  const match = summaryText.match(regex)

  return match && match[1] ? parseInt(match[1], 10) : null
}

export function parseSubito(html: string): SearchResult | null {
  const $ = load(html)

  const amountOfResults = getNumberOfResults($)
  if (!amountOfResults || amountOfResults === 0) {
    return null
  }

  return {
    platformId: 'subito',
    amountOfResults,
    minPrice: getMinPrice($),
  }
}
