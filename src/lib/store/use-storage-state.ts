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
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string,
    ) => {
      if (areaName === 'local' && changes[key]) {
        setState(changes[key].newValue ?? initialValue)
      }
    }

    // Listen for changes in storage
    chrome.storage.onChanged.addListener(handleStorageChange)

    // Get initial value from storage
    chrome.storage.local.get([key], (result) => {
      setState(result[key] ?? initialValue)
    })

    // Clean up listener
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  return [state, setSyncedState] as const
}
