import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

//@ts-ignore
const isDev = process.env.NODE_ENV == 'development'

export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? ` ➡️ Dev` : ''}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-34.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
  },
  devtools_page: 'devtools.html',
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: [],
    },
  ],
  host_permissions: [
    'https://www.kleinanzeigen.de/*',
    'https://www.dba.dk/*',
    'https://www.willhaben.at/*',
    'https://www.subito.it/*',
    'https://www.leboncoin.fr/*',
    'https://www.milanuncios.com/*',
    'https://www.gumtree.com/*',
    'https://www.marktplaats.nl/*',
    'https://www.blocket.se/*',
    'https://www.finn.no/*',
  ],
  permissions: ['storage', 'tabs', 'scripting'],
})
