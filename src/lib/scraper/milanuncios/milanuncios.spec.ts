import * as fs from 'fs'
import * as path from 'path'

import { parseMilanuncios } from './milanuncios'

function readHtmlFile(filename: string): string {
  const filePath = path.join(__dirname, 'fixtures', filename)
  return fs.readFileSync(filePath, 'utf8')
}

describe('Milanuncios', () => {
  describe('parseMilanuncios', () => {
    it.each([
      {
        filename: 'single.html',
        amountOfResults: 1,
        minPrice: 5900,
      },
      {
        filename: 'multi.html',
        amountOfResults: 164,
        minPrice: 1000,
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
        const result = parseMilanuncios(html)
        expect(result).toEqual({
          platformId: 'milanuncios',
          amountOfResults,
          minPrice,
        })
      },
    )
  })
})
