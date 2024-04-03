import * as fs from 'fs'
import * as path from 'path'

import { parseFinn } from './finn'

function readHtmlFile(filename: string): string {
  const filePath = path.join(__dirname, 'fixtures', filename)
  return fs.readFileSync(filePath, 'utf8')
}

describe('Finn', () => {
  describe('parseFinn', () => {
    it.each([
      {
        filename: 'single.html',
        amountOfResults: 1,
        minPrice: 2500,
      },
      {
        filename: 'multi.html',
        amountOfResults: 14,
        minPrice: 300,
      },
      {
        filename: 'multi2.html',
        amountOfResults: 15282,
        minPrice: 1,
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
        const result = parseFinn(html)
        expect(result).toEqual({
          platformId: 'finn',
          amountOfResults,
          minPrice,
        })
      },
    )
  })
})
