import React from 'react'
import { Button, Input, ButtonLoading, ScrollArea, Separator } from '@/components/ui'
import { Platform, platforms } from '@/lib'
import { sendDomExtractionRequest } from '@/lib/dom'
import { useQueries } from '@tanstack/react-query'
import { useStorageState, useSettings } from '@/lib/store'
import { SearchResultItem } from './search-result-item'

async function searchPlatform(platform: Platform, searchTerm: string) {
  const url = platform.toSearchUrl(searchTerm)
  const html = await sendDomExtractionRequest(url)
  return platform.toScrapedSearchResult(html)
}

const Search = () => {
  const [searchTerm, setSearchTerm] = useStorageState<string>('popup.searchTerm', '')
  const [activeSearchTerm, setActiveSearchTerm] = useStorageState<string>(
    'popup.activeSearchTerm',
    '',
  )
  const [settingsState] = useSettings()

  const { searchResults, isLoading, isFetching } = useQueries({
    queries: Object.values(platforms).map((platform) => {
      const isPlatformEnabled = settingsState.platformSettings[platform.id].enabled
      return {
        queryKey: ['search', { platform, activeSearchTerm, isPlatformEnabled }],
        queryFn: () => searchPlatform(platform, activeSearchTerm),
        enabled: !!activeSearchTerm && isPlatformEnabled,
      }
    }),
    combine: (results) => {
      return {
        searchResults: results
          .filter((result) => result.isFetched)
          .map((result) => result.data)
          .filter((result) => result?.amountOfResults ?? 0 > 0),
        isLoading: results.some((result) => result.isLoading),
        isError: results.some((result) => result.isError),
        isFetched: results.every((result) => result.isFetched),
        isFetching: results.some((result) => result.isFetching),
        refetch: () => results.map((result) => result.refetch()),
      }
    },
  })

  const onSubmit: React.EventHandler<any> = async (e) => {
    e.preventDefault()
    setActiveSearchTerm(searchTerm)
    setSearchTerm('')
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setActiveSearchTerm('')
  }

  const visitUrl = (url: string) => {
    chrome.tabs.create({ url })
  }

  return (
    <>
      <div className="flex items-center space-x-2 my-2">
        <form className="flex space-x-2 w-full" onSubmit={onSubmit}>
          <Input
            type="text"
            placeholder="Enter your search query"
            value={searchTerm}
            onChange={onChange}
          />
          {isLoading ? (
            <ButtonLoading />
          ) : (
            <Button variant="default" type="submit" disabled={!searchTerm}>
              Search
            </Button>
          )}
        </form>
      </div>
      {!activeSearchTerm && (
        <div className="flex flex-col space-y-1.5 my-4">
          <h3 className="text-base font-semibold leading-none tracking-tight">
            Please enter search query
          </h3>
          <p className="text-sm text-muted-foreground">Please enter a search query to find items</p>
        </div>
      )}
      {!isLoading && !isFetching && activeSearchTerm && searchResults.length === 0 && (
        <div className="flex flex-col space-y-1.5 my-4">
          <h3 className="text-base font-semibold leading-none tracking-tight">
            No results found for "{activeSearchTerm}"
          </h3>
          <p className="text-sm text-muted-foreground">
            Please enter a new search query to try again
          </p>
        </div>
      )}
      {searchResults.length > 0 && (
        <div className="flex flex-col space-y-1.5 my-2 pt-4">
          <h3 className="text-base font-semibold leading-none tracking-tight">
            Results for "{activeSearchTerm}"
          </h3>
          <p className="text-sm text-muted-foreground pb-2">
            We have found {searchResults.length}{' '}
            {searchResults.length === 1 ? 'result ' : 'results '}
            for your search query:
          </p>
          <ScrollArea className="max-h-60 full-w rounded-md border overflow-scroll mt-4">
            <div className="p-4">
              <div className="space-y-4">
                {searchResults
                  .sort((a, b) => (b?.amountOfResults ?? 0) - (a?.amountOfResults ?? 0))
                  .map((result, index) => {
                    if (!result) return null
                    const platform = platforms[result.platformId]

                    return (
                      <React.Fragment key={result.platformId + index}>
                        <SearchResultItem
                          key={result.platformId + index}
                          platform={platform}
                          itemsAmount={result.amountOfResults}
                          minPrice={result.minPrice}
                          onButtonClick={() => visitUrl(platform.toSearchUrl(activeSearchTerm))}
                        />
                        {index < searchResults.length - 1 && <Separator />}
                      </React.Fragment>
                    )
                  })}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  )
}

export default Search
