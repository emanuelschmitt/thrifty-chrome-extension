import React from 'react'

const DEFAULT_STORAGE_PREFIX = 'thrifty-storage-state:'

export function useStorageState<T>(key: string, initialValue: T) {
  // Add a prefix to avoid conflicts with other data
  key = `${DEFAULT_STORAGE_PREFIX}${key}`

  const [state, setState] = React.useState<T>(initialValue)

  const setSyncedState = (value: T) => {
    chrome.storage.local.set({ [key]: value }, () => {
      setState(value)
    })
  }

  React.useEffect(() => {
    chrome.storage.local.get([key], (result) => {
      setState(result[key] ?? initialValue)
    })
  }, [])

  return [state, setSyncedState] as const
}
