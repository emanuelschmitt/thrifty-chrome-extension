import { Platform, platforms } from '@/lib'
import { sendDomExtractionRequest } from '@/lib/dom'
import { useQueries } from '@tanstack/react-query'
import { useSettings } from '@/lib/store'

async function searchPlatform(platform: Platform, searchTerm: string) {
  const url = platform.toSearchUrl(searchTerm)
  const html = await sendDomExtractionRequest(url)
  return platform.toScrapedSearchResult(html)
}

type UseSearchQueryProps = {
  activeSearchTerm: string
}

export function useSearchQuery({ activeSearchTerm }: UseSearchQueryProps) {
  const [settingsState] = useSettings()

  return useQueries({
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
      }
    },
  })
}
