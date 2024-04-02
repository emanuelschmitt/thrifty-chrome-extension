import {
  parseDBA,
  parseKleinanzeigen,
  parseSubito,
  parseWillhaben,
  parseLeboncoin,
  parseMilanuncios,
  parseGumtree,
  parseMarktplaats,
  parseBlocket,
} from './scraper'

export type PlatformId =
  | 'kleinanzeigen'
  | 'dba'
  | 'willhaben'
  | 'subito'
  | 'leboncoin'
  | 'milanuncios'
  | 'gumtree'
  | 'marktplaats'
  | 'blocket'

export type Country =
  | 'Germany'
  | 'Denmark'
  | 'France'
  | 'Spain'
  | 'Italy'
  | 'United Kingdom'
  | 'Austria'
  | 'Netherlands'
  | 'Sweden'

export type Currency = 'EUR' | 'DKK' | 'GBP' | 'SEK'

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
  minPrice: number | null
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
    toScrapedSearchResult: parseKleinanzeigen,
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
  subito: {
    id: 'subito',
    name: 'Subito',
    url: 'https://www.subito.it',
    country: 'Italy',
    currency: 'EUR',
    toSearchUrl: (searchTerm) => {
      searchTerm = searchTerm.trim().toLocaleLowerCase().replace(/\s/g, '+')
      return `https://www.subito.it/annunci-italia/vendita/usato/?q=${searchTerm}&order=priceasc`
    },
    toScrapedSearchResult: parseSubito,
  },
  leboncoin: {
    id: 'leboncoin',
    name: 'Leboncoin',
    url: 'https://www.leboncoin.fr',
    country: 'France',
    currency: 'EUR',
    toSearchUrl: (searchTerm) => {
      searchTerm = encodeURIComponent(searchTerm.trim())
      return `https://www.leboncoin.fr/recherche/?text=${searchTerm}&sort=price&order=asc`
    },
    toScrapedSearchResult: parseLeboncoin,
  },
  milanuncios: {
    id: 'milanuncios',
    name: 'Milanuncios',
    url: 'https://www.milanuncios.com',
    country: 'Spain',
    currency: 'EUR',
    toSearchUrl: (searchTerm) => {
      searchTerm = encodeURIComponent(searchTerm.trim())
      return `https://www.milanuncios.com/anuncios/?s=${searchTerm}&orden=baratos&fromSearch=1`
    },
    toScrapedSearchResult: parseMilanuncios,
  },
  gumtree: {
    id: 'gumtree',
    name: 'Gumtree',
    url: 'https://www.gumtree.com',
    country: 'United Kingdom',
    currency: 'GBP',
    toSearchUrl: (searchTerm) => {
      searchTerm = encodeURIComponent(searchTerm.trim())
      return `https://www.gumtree.com/search?q=${searchTerm}&sort=price_lowest_first`
    },
    toScrapedSearchResult: parseGumtree,
  },
  marktplaats: {
    id: 'marktplaats',
    name: 'Marktplaats',
    url: 'https://www.marktplaats.nl',
    country: 'Netherlands',
    currency: 'EUR',
    toSearchUrl: (searchTerm) => {
      searchTerm = encodeURIComponent(searchTerm.trim())
      return `https://www.marktplaats.nl/q/${searchTerm}/#sortBy:PRICE|sortOrder:INCREASING`
    },
    toScrapedSearchResult: parseMarktplaats,
  },
  blocket: {
    id: 'blocket',
    name: 'Blocket',
    url: 'https://www.blocket.se',
    country: 'Sweden',
    currency: 'SEK',
    toSearchUrl: (searchTerm) => {
      searchTerm = encodeURIComponent(searchTerm.trim())
      return `https://www.blocket.se/annonser/hela_sverige?q=${searchTerm}&sort=price`
    },
    toScrapedSearchResult: parseBlocket,
  },
}
