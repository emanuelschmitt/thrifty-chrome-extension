import * as fs from 'fs'
import * as path from 'path'

import { parseWillhaben } from './willhaben'

function readHtmlFile(filename: string): string {
  const filePath = path.join(__dirname, 'fixtures', filename)
  return fs.readFileSync(filePath, 'utf8')
}

describe('Willhaben', () => {
  describe('parseWillhaben', () => {
    it.each([
      {
        filename: 'single.html',
        amountOfResults: 1,
        minPrice: 5000,
      },
      {
        filename: 'multi.html',
        amountOfResults: 3,
        minPrice: 300,
      },
      {
        filename: 'multi-2.html',
        amountOfResults: 133993,
        minPrice: null,
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
        const result = parseWillhaben(html)
        expect(result).toEqual({
          platformId: 'willhaben',
          amountOfResults,
          minPrice,
        })
      },
    )
  })
})
