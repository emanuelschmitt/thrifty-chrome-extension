import { parseDBA, parseEbayKleinanzeigen, parseWillhaben } from './scraper'

export type PlatformId = 'kleinanzeigen' | 'dba' | 'willhaben'
export type Country =
  | 'Germany'
  | 'Denmark'
  | 'France'
  | 'Spain'
  | 'Italy'
  | 'United Kingdom'
  | 'Austria'
export type Currency = 'EUR' | 'DKK' | 'GBP'

export type Platform = {
  id: PlatformId
  name: string
  url: string
  country: Country
  currency: Currency
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
    currency: 'EUR',
    toSearchUrl: (searchTerm) => {
      searchTerm = searchTerm.trim().toLocaleLowerCase().replace(/\s/g, '-')
      return `https://www.ebay-kleinanzeigen.de/s-sortierung:preis/${searchTerm}/k0`
    },
    toScrapedSearchResult: parseEbayKleinanzeigen,
  },
  dba: {
    id: 'dba',
    name: 'DBA',
    url: 'https://www.dba.dk',
    country: 'Denmark',
    currency: 'DKK',
    toSearchUrl: (searchTerm) => {
      searchTerm = searchTerm.trim().toLocaleLowerCase().replace(/\s/g, '+')
      return `https://www.dba.dk/soeg/?soeg=${searchTerm}&sort=price`
    },
    toScrapedSearchResult: parseDBA,
  },
  willhaben: {
    id: 'willhaben',
    name: 'Willhaben',
    url: 'https://www.willhaben.at',
    country: 'Austria',
    currency: 'EUR',
    toSearchUrl: (searchTerm) => {
      searchTerm = searchTerm.trim().toLocaleLowerCase().replace(/\s/g, '+')
      return `https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz?keyword=${searchTerm}&page=1&sort=3`
    },
    toScrapedSearchResult: parseWillhaben,
  },
}
