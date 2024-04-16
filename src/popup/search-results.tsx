import React from 'react'
import { ScrollArea, Separator } from '@/components/ui'
import { SearchResult as TSearchResult, platforms } from '@/lib'
import { SearchResultItem } from './search-result-item'
import { HeaderInfo } from './header-info'
import { useSearchQuery } from './use-search-query'

type SearchResultProps = {
  activeSearchTerm: string
}

export const SearchResult = ({ activeSearchTerm }: SearchResultProps) => {
  const { searchResults, isLoading, isFetching } = useSearchQuery({ activeSearchTerm })

  const visitUrl = (url: string) => {
    chrome.tabs.create({ url })
  }

  if (!activeSearchTerm) {
    return (
      <HeaderInfo title="Search for items" descripton="Please enter a search query to find items" />
    )
  }

  if (!isLoading && !isFetching && searchResults.length === 0) {
    return (
      <HeaderInfo
        title="No results found"
        descripton={`No results found for "${activeSearchTerm}". Please enter a new search query to try again`}
      />
    )
  }

  if ((isLoading || isFetching) && searchResults.length === 0) {
    return (
      <HeaderInfo
        title="Searching for items..."
        descripton={`Searching for items related to "${activeSearchTerm}". Please wait...`}
      />
    )
  }

  return (
    <div>
      <HeaderInfo
        title={`Results for "${activeSearchTerm}"`}
        descripton={`We have found ${searchResults.length} ${searchResults.length === 1 ? 'result ' : 'results '} for your search query:`}
      >
        <ScrollArea className="max-h-60 full-w rounded-md border overflow-scroll mt-2">
          <div className="p-4">
            <div className="space-y-4">
              {searchResults
                .sort((a, b) => (b?.amountOfResults ?? 0) - (a?.amountOfResults ?? 0))
                .filter((result: any): result is TSearchResult => !!result)
                .map((result, index) => {
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
      </HeaderInfo>
    </div>
  )
}
