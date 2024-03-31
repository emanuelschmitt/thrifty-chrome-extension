import * as fs from 'fs'
import * as path from 'path'

import { parseDBA } from './dba'

function readHtmlFile(filename: string): string {
  const filePath = path.join(__dirname, 'fixtures', filename)
  return fs.readFileSync(filePath, 'utf8')
}

describe('DBA', () => {
  describe('parseDBA', () => {
    it.each([
      {
        filename: 'single.html',
        amountOfResults: 1,
        minPrice: 1800,
      },
      {
        filename: 'multi.html',
        amountOfResults: 8,
        minPrice: 800,
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
        const result = parseDBA(html)
        expect(result).toEqual({
          platformId: 'dba',
          amountOfResults,
          minPrice,
        })
      },
    )
  })
})
