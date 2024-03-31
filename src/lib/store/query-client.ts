import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

const STORAGE_KEY = 'thrifty:query-client'
const GC_TIME_MS = 1000 * 60 * 60 * 24

export const asyncStoragePersister = createAsyncStoragePersister({
  key: STORAGE_KEY,
  storage: {
    getItem: async (key) => {
      const value = await chrome.storage.local.get(key)
      return value[key]
    },
    setItem: async (key, value) => {
      await chrome.storage.local.set({
        [key]: value,
      })
    },
    removeItem: (key) => chrome.storage.local.remove(key),
  },
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: GC_TIME_MS,
      staleTime: 1000 * 60 * 5, // 5min
      refetchOnWindowFocus: false, // default: true
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
})
