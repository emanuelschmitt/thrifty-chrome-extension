import * as fs from 'fs'
import * as path from 'path'

import { parseGumtree } from './gumtree'

function readHtmlFile(filename: string): string {
  const filePath = path.join(__dirname, 'fixtures', filename)
  return fs.readFileSync(filePath, 'utf8')
}

describe('Gumtree', () => {
  describe('parseGumtree', () => {
    it.each([
      {
        filename: 'single.html',
        amountOfResults: 1,
        minPrice: 700,
      },
      {
        filename: 'multi.html',
        amountOfResults: 2,
        minPrice: 15000,
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
        const result = parseGumtree(html)
        expect(result).toEqual({
          platformId: 'gumtree',
          amountOfResults,
          minPrice,
        })
      },
    )
  })
})
