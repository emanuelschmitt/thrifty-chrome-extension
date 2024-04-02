import * as fs from 'fs'
import * as path from 'path'

import { parseLeboncoin } from './leboncoin'

function readHtmlFile(filename: string): string {
  const filePath = path.join(__dirname, 'fixtures', filename)
  return fs.readFileSync(filePath, 'utf8')
}

describe('Leboncoin', () => {
  describe('parseLeboncoin', () => {
    it.each([
      {
        filename: 'single.html',
        amountOfResults: 1,
        minPrice: 9000,
      },
      {
        filename: 'multi.html',
        amountOfResults: 96,
        minPrice: 500,
      },
      {
        filename: 'multi-2.html',
        amountOfResults: 38351,
        minPrice: 0,
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
        const result = parseLeboncoin(html)
        expect(result).toEqual({
          platformId: 'leboncoin',
          amountOfResults,
          minPrice,
        })
      },
    )
  })
})
