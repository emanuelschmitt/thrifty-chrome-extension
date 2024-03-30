import { parseEbayKleinanzeigen } from './scraper'

export type PlatformId = 'kleinanzeigen'
export type Country = 'Germany' | 'France' | 'Spain' | 'Italy' | 'United Kingdom'

export type Platform = {
  id: PlatformId
  name: string
  url: string
  country: Country
  toSearchUrl: (searchTerm: string) => string
  toScrapedSearchResult: (html: string) => SearchResult | null
}

export type SearchResult = {
  platformId: PlatformId
  amountOfResults: number
  minPrice: number
}

export const platforms: Record<PlatformId, Platform> = {
  kleinanzeigen: {
    id: 'kleinanzeigen',
    name: 'eBay Kleinanzeigen',
    url: 'https://www.ebay-kleinanzeigen.de',
    country: 'Germany',
    toSearchUrl: (searchTerm) => {
      searchTerm = searchTerm.trim().toLocaleLowerCase().replace(/\s/g, '-')
      return `https://www.ebay-kleinanzeigen.de/s-${searchTerm}/k0`
    },
    toScrapedSearchResult: parseEbayKleinanzeigen,
  },
}
