import * as fs from 'fs'
import * as path from 'path'

import { parseMarktplaats } from './marktplaats'

function readHtmlFile(filename: string): string {
  const filePath = path.join(__dirname, 'fixtures', filename)
  return fs.readFileSync(filePath, 'utf8')
}

describe('Marktplaats', () => {
  /**
   * This test does not work, it works in the plugin but somehow these html files are corrupted
   */
  describe('parseMarktplaats', () => {
    it.each([
      {
        filename: 'single.html',
        amountOfResults: 1,
        minPrice: 1500,
      },
      {
        filename: 'multi.html',
        amountOfResults: 39,
        minPrice: 400,
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
        const result = parseMarktplaats(html)
        expect(result).toEqual({
          platformId: 'marktplaats',
          amountOfResults,
          minPrice,
        })
      },
    )
  })
})
