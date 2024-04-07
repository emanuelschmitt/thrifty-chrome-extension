import { PlatformId } from '@/lib'
import { useStorageState } from '@/lib/store'

export type Settings = {
  platformSettings: {
    [key in PlatformId]: {
      enabled: boolean
    }
  }
}

const defaultValues: Settings = {
  platformSettings: {
    kleinanzeigen: {
      enabled: true,
    },
    dba: {
      enabled: true,
    },
    willhaben: {
      enabled: true,
    },
    subito: {
      enabled: true,
    },
    leboncoin: {
      enabled: true,
    },
    milanuncios: {
      enabled: true,
    },
    gumtree: {
      enabled: true,
    },
    marktplaats: {
      enabled: true,
    },
    blocket: {
      enabled: true,
    },
    finn: {
      enabled: true,
    },
  },
}

export function useSettings() {
  return useStorageState<Settings>('settings', defaultValues)
}
