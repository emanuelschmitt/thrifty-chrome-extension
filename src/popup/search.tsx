import React from 'react'
import { Button, Input, ButtonLoading } from '@/components/ui'
import { useStorageState } from '@/lib/store'
import { SearchResult } from './search-results'
import { useIsFetching } from '@tanstack/react-query'

const Search = () => {
  const [searchTerm, setSearchTerm] = useStorageState<string>('popup.searchTerm', '')
  const [activeSearchTerm, setActiveSearchTerm] = useStorageState<string>(
    'popup.activeSearchTerm',
    '',
  )

  const isLoading = useIsFetching({
    predicate: (query) => query.queryKey[0] === 'search',
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
      <SearchResult activeSearchTerm={activeSearchTerm} />
    </>
  )
}

export default Search
