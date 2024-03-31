import * as fs from 'fs'
import * as path from 'path'

import { parseSubito } from './subito'

function readHtmlFile(filename: string): string {
  const filePath = path.join(__dirname, 'fixtures', filename)
  return fs.readFileSync(filePath, 'utf8')
}

describe('Leboncoin', () => {
  describe('parseSubito', () => {
    it.each([
      {
        filename: 'single.html',
        amountOfResults: 1,
        minPrice: 16500,
      },
      {
        filename: 'multi.html',
        amountOfResults: 10,
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
        const result = parseSubito(html)
        expect(result).toEqual({
          platformId: 'subito',
          amountOfResults,
          minPrice,
        })
      },
    )
  })
})
