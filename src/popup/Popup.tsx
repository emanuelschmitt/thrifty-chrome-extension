import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SearchResult, platforms, toCountryEmoji } from '@/lib'
import { ArrowRightIcon, LogoIcon } from '@/components/ui/icons'
import { extractDomContent } from '@/lib/dom'

const SearchResultItem = ({
  name,
  itemsAmount,
  minPrice,
  onButtonClick,
}: {
  name: string
  itemsAmount: number
  minPrice: number
  onButtonClick(): void
}) => (
  <div className="flex items-center space-x-4 rounded-lg w-full">
    <div className="flex-shrink-0">
      <Avatar>
        {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
        <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
      </Avatar>
    </div>
    <div className="flex-grow">
      <h2 className="text-sm font-semibold">{name}</h2>
      <p className="text-sm text-gray-500">
        {itemsAmount} Items found from {minPrice} EUR
      </p>
    </div>
    <div className="flex-shrink-0">
      <Button variant="secondary" size="icon" onClick={onButtonClick}>
        <ArrowRightIcon />
      </Button>
    </div>
  </div>
)

export const Popup = () => {
  // useEffect(() => {
  //   chrome.storage.sync.get(['count'], (result) => {
  //     setCount(result.count || 0)
  //   })
  // }, [])

  // useEffect(() => {
  //   chrome.storage.sync.set({ count })
  //   chrome.runtime.sendMessage({ type: 'COUNT', count })
  // }, [count])

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchResult, setSearchResult] = useState<SearchResult[]>([])

  const onClick: React.EventHandler<any> = async (e) => {
    e.preventDefault()
    setSearchResult([])
    try {
      for (const platform of Object.values(platforms)) {
        const url = platform.toSearchUrl(searchTerm)
        extractDomContent(url).then((html) => {
          const result = platform.toScrapedSearchResult(html)
          if (result) {
            setSearchResult((prev) => [...prev, result])
          }
        })
      }
    } catch (error) {
      console.error(error)
    }
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
        <form className="flex space-x-2 w-full" onSubmit={onClick}>
          <Input
            type="text"
            placeholder="Enter your search query"
            value={searchTerm}
            onChange={(e) => {
              e.preventDefault()
              setSearchTerm(e.target.value)
            }}
          />
          <Button variant="default" type="submit">
            Search
          </Button>
        </form>
      </div>
      {searchResult.length === 0 && (
        <div className="flex flex-col space-y-1.5 p-4">
          <h3 className="text-base font-semibold leading-none tracking-tight">No results found</h3>
          <p className="text-sm text-muted-foreground">Please enter a search query to find items</p>
        </div>
      )}
      {searchResult.length > 0 && (
        <div className="flex flex-col space-y-1.5 p-4">
          <h3 className="text-base font-semibold leading-none tracking-tight">
            Results for "{searchTerm}"
          </h3>
          <p className="text-sm text-muted-foreground">
            We have found following items that might interest you:
          </p>
          <div className="space-y-4 pt-2">
            {searchResult.map((result, index) => {
              const platform = platforms[result.platformId]
              return (
                <SearchResultItem
                  key={index}
                  name={`${platform.name} ${toCountryEmoji(platform.country)}`}
                  itemsAmount={result.amountOfResults}
                  minPrice={result.minPrice}
                  onButtonClick={() => visitUrl(platform.toSearchUrl('mutable instruments'))}
                />
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}

export default Popup
