import React from 'react'
import {
  Button,
  Input,
  ButtonLoading,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
} from '@/components/ui'
import { SearchIcon, SettingsIcon } from 'lucide-react'
import { Platform, platforms } from '@/lib'
import { extractDomContent } from '@/lib/dom'
import { withProviders } from '@/lib/providers'
import { useQueries } from '@tanstack/react-query'
import { useStorageState } from '@/lib/store'
import { SearchResultItem } from './search-result-item'
import { Layout } from './layout'
import { Settings } from './settings'
import { useSettings } from './use-settings'

async function searchPlatform(platform: Platform, searchTerm: string) {
  const url = platform.toSearchUrl(searchTerm)
  const html = await extractDomContent(url)
  return platform.toScrapedSearchResult(html)
}

const Popup = () => {
  const [tempSearchTerm, setTempSearchTerm] = useStorageState<string>('popup.tempSearchTerm', '')
  const [searchTerm, setSearchTerm] = useStorageState<string>('popup.searchTerm', '')
  const [settingsState] = useSettings()

  let { searchResults, isLoading } = useQueries({
    queries: Object.values(platforms).map((platform) => {
      const isPlatformEnabled = settingsState.platformSettings[platform.id].enabled
      return {
        queryKey: ['search', { platform, searchTerm, isPlatformEnabled }],
        queryFn: () => searchPlatform(platform, searchTerm),
        enabled: !!searchTerm && !!platform.id && isPlatformEnabled,
      }
    }),
    combine: (results) => ({
      searchResults: results
        .filter((result) => result.isFetched)
        .map((result) => result.data)
        .filter((result) => result?.amountOfResults ?? 0 > 0),
      isLoading: results.some((result) => result.isLoading),
      isError: results.some((result) => result.isError),
      isFetched: results.every((result) => result.isFetched),
    }),
  })

  const onSubmit: React.EventHandler<any> = async (e) => {
    e.preventDefault()
    if (!tempSearchTerm) return
    setSearchTerm(tempSearchTerm)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearchTerm(e.target.value)
  }

  const visitUrl = (url: string) => {
    chrome.tabs.create({ url })
  }

  return (
    <Layout>
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="w-full mb-2">
          <TabsTrigger value="search" className="w-full">
            <SearchIcon size="16" className="mr-1" /> Search
          </TabsTrigger>
          <TabsTrigger value="settings" className="w-full">
            <SettingsIcon size="16" className="mr-1" /> Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="search" className="px-0">
          <div className="flex items-center space-x-2 my-2">
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
            <div className="flex flex-col space-y-1.5 my-4">
              <h3 className="text-base font-semibold leading-none tracking-tight">
                Please enter search query
              </h3>
              <p className="text-sm text-muted-foreground">
                Please enter a search query to find items
              </p>
            </div>
          )}
          {!isLoading && searchResults.length === 0 && (
            <div className="flex flex-col space-y-1.5 my-4">
              <h3 className="text-base font-semibold leading-none tracking-tight">
                No results found
              </h3>
              <p className="text-sm text-muted-foreground">
                Please enter a new search query to try again
              </p>
            </div>
          )}
          {searchResults.length > 0 && (
            <div className="flex flex-col space-y-1.5 my-2 pt-4">
              <h3 className="text-base font-semibold leading-none tracking-tight">
                Results for "{searchTerm}"
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
                          <>
                            <SearchResultItem
                              key={result.platformId + index}
                              platform={platform}
                              itemsAmount={result.amountOfResults}
                              minPrice={result.minPrice}
                              onButtonClick={() => visitUrl(platform.toSearchUrl(searchTerm))}
                            />
                            {index < searchResults.length - 1 && <Separator />}
                          </>
                        )
                      })}
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </TabsContent>
        <TabsContent value="settings">
          <Settings />
        </TabsContent>
      </Tabs>
    </Layout>
  )
}

export default withProviders(Popup)
