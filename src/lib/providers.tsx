import React from 'react'
import { queryClient, asyncStoragePersister } from './store'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

export const withProviders = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return (props: P) => (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
      }}
    >
      <WrappedComponent {...props} />
    </PersistQueryClientProvider>
  )
}
