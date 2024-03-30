import React from 'react'
import { Button, Input, LogoIcon, ButtonLoading } from '@/components/ui'
import { Platform, platforms, toCountryEmoji } from '@/lib'
import { extractDomContent } from '@/lib/dom'
import { withProviders } from '@/lib/providers'
import { useQueries } from '@tanstack/react-query'
import { queryOptions } from '@tanstack/react-query'
import { useStorageState } from '@/lib/store'
import { SearchResultItem } from './search-result-item'

async function searchPlatform(platform: Platform, searchTerm: string) {
  const url = platform.toSearchUrl(searchTerm)
  const html = await extractDomContent(url)
  return platform.toScrapedSearchResult(html)
}

const Popup = () => {
  const [tempSearchTerm, setTempSearchTerm] = useStorageState<string>('popup.tempSearchTerm', '')
  const [searchTerm, setSearchTerm] = useStorageState<string>('popup.searchTerm', '')

  const { searchResults, isLoading, isFetched } = useQueries({
    queries: Object.values(platforms).map((platform) =>
      queryOptions({
        queryKey: ['search', { platform, searchTerm }],
        queryFn: () => searchPlatform(platform, searchTerm),
        enabled: !!searchTerm && !!platform.id,
      }),
    ),
    combine: (results) => ({
      searchResults: results
        .filter((result) => result.isFetched)
        .map((result) => result.data)
        .filter(Boolean),
      isLoading: results.some((result) => result.isLoading),
      isError: results.some((result) => result.isError),
      isFetched: results.every((result) => result.isFetched),
    }),
  })

  const onSubmit: React.EventHandler<any> = async (e) => {
    e.preventDefault()
    setSearchTerm(tempSearchTerm)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearchTerm(e.target.value)
  }

  const visitUrl = (url: string) => {
    chrome.tabs.create({ url })
  }

  return (
    <main className="flex flex-col w-full mb-4">
      <div className="flex items-center space-x-2 w-full mb-2 bg-[#CCCCFF] p-4">
        <LogoIcon className="w-8 h-8" />
        <h1 className="text-xl font-bold">Thrifty</h1>
      </div>
      <div className="flex items-center space-x-2 p-4">
        <form className="flex space-x-2 w-full" onSubmit={onSubmit}>
          <Input
            type="text"
            placeholder="Enter your search query"
            value={tempSearchTerm}
            onChange={onChange}
          />
          {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button variant="default" type="submit">
              Search
            </Button>
          )}
        </form>
      </div>
      {!searchTerm && (
        <div className="flex flex-col space-y-1.5 p-4">
          <h3 className="text-base font-semibold leading-none tracking-tight">
            Please enter search query
          </h3>
          <p className="text-sm text-muted-foreground">Please enter a search query to find items</p>
        </div>
      )}
      {isFetched && !isLoading && searchResults.length === 0 && (
        <div className="flex flex-col space-y-1.5 p-4">
          <h3 className="text-base font-semibold leading-none tracking-tight">No results found</h3>
          <p className="text-sm text-muted-foreground">Please enter a search query to try again</p>
        </div>
      )}
      {isFetched && searchResults.length > 0 && (
        <div className="flex flex-col space-y-1.5 p-4">
          <h3 className="text-base font-semibold leading-none tracking-tight">
            Results for "{searchTerm}"
          </h3>
          <p className="text-sm text-muted-foreground">
            We have found following items that might interest you:
          </p>
          <div className="space-y-4 pt-4">
            {searchResults.map((result, index) => {
              if (!result) return null
              const platform = platforms[result.platformId]
              return (
                <SearchResultItem
                  key={result.platformId + index}
                  name={`${platform.name} ${toCountryEmoji(platform.country)}`}
                  itemsAmount={result.amountOfResults}
                  minPrice={result.minPrice}
                  currency={platform.currency}
                  onButtonClick={() => visitUrl(platform.toSearchUrl(searchTerm))}
                />
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}

export default withProviders(Popup)
