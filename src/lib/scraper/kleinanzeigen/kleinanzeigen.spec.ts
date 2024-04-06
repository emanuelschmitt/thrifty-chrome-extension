import * as fs from 'fs'
import * as path from 'path'

import { parseKleinanzeigen } from './kleinanzeigen'

function readHtmlFile(filename: string): string {
  const filePath = path.join(__dirname, 'fixtures', filename)
  return fs.readFileSync(filePath, 'utf8')
}

describe('Kleinanzeigen', () => {
  describe('parseKleinanzeigen', () => {
    it.each([
      {
        filename: 'single.html',
        amountOfResults: 1,
        minPrice: 54300,
      },
      {
        filename: 'single-2.html',
        amountOfResults: 1,
        minPrice: 114900,
      },
      {
        filename: 'multi.html',
        amountOfResults: 2,
        minPrice: 52900,
      },
      {
        filename: 'multi-2.html',
        amountOfResults: 43065,
        minPrice: 0,
      },
      {
        filename: 'multi-3.html',
        amountOfResults: 82,
        minPrice: 100,
      },
      {
        filename: 'not-found.html',
        amountOfResults: 0,
        minPrice: null,
      },
    ])(
      'should return the amount of results and the minimum price',
      ({ amountOfResults, filename, minPrice }) => {
        const html = readHtmlFile(filename)
        const result = parseKleinanzeigen(html)
        expect(result).toEqual({
          platformId: 'kleinanzeigen',
          amountOfResults,
          minPrice,
        })
      },
    )
  })
})
