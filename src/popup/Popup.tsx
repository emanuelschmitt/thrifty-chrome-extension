import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { SearchIcon, SettingsIcon } from 'lucide-react'
import { withProviders } from '@/lib/providers'
import { Layout } from './layout'
import { Settings } from './settings'
import Search from './search'

const Popup = () => {
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
          <Search />
        </TabsContent>
        <TabsContent value="settings">
          <Settings />
        </TabsContent>
      </Tabs>
    </Layout>
  )
}

export default withProviders(Popup)
