import * as fs from 'fs'
import * as path from 'path'

import { parseBlocket } from './blocket'

function readHtmlFile(filename: string): string {
  const filePath = path.join(__dirname, 'fixtures', filename)
  return fs.readFileSync(filePath, 'utf8')
}

describe('Blocket', () => {
  describe('parseBlocket', () => {
    it.each([
      {
        filename: 'single.html',
        amountOfResults: 1,
        minPrice: 750,
      },
      {
        filename: 'multi.html',
        amountOfResults: 1003,
        minPrice: 5,
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
        const result = parseBlocket(html)
        expect(result).toEqual({
          platformId: 'blocket',
          amountOfResults,
          minPrice,
        })
      },
    )
  })
})
