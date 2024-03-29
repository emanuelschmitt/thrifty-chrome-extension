import React, { SVGProps } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 30 30" {...props}>
    <title>{'saving-piggy-bank-collect-money'}</title>
    <path d="M26 11V9a4.008 4.008 0 0 0-3-3.874V2a1 1 0 0 0-1-1h-1a5.008 5.008 0 0 0-4.9 4H5a3.9 3.9 0 0 0-.532.054L2.707 3.293a1 1 0 0 0-1.414 1.414l1.2 1.2A3.976 3.976 0 0 0 1 9v13a4.008 4.008 0 0 0 3 3.874V26a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3h3a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-.126A4.008 4.008 0 0 0 26 22v-3a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3Zm1 5a1 1 0 0 1-1 1h-1a1 1 0 0 0-1 1v4a2 2 0 0 1-2 2 1 1 0 0 0-1 1v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1h-5a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1 2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h12a1 1 0 0 0 1-1 3 3 0 0 1 3-3v3a1 1 0 0 0 1 1 2 2 0 0 1 2 2v3a1 1 0 0 0 1 1h1a1 1 0 0 1 1 1Z" />
    <path d="M21 11h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2ZM15 9H7a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2Z" />
  </svg>
)

const SearchResultItem = ({
  name,
  itemsAmount,
  minPrice,
}: {
  name: string
  itemsAmount: number
  minPrice: number
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
      <Button variant="secondary" size="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
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

  const scrape = async () => {
    const tab = await chrome.tabs.create({
      active: false,
      url: 'https://www.kleinanzeigen.de/s-mutable-instruments/k0',
    })
    if (!tab.id) throw new Error('Tab id not found')

    return new Promise(async (resolve) => {
      chrome.runtime.onMessage.addListener((msg, sender) => {
        if (msg.method === 'dom' && sender?.tab?.id === tab.id) {
          resolve(msg.data)
          chrome.runtime.onMessage.removeListener(() => {})
        }
      })
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          func: () => {
            chrome.runtime.sendMessage({ method: 'dom', data: document.body.innerHTML })
          },
        })
      } finally {
        chrome.tabs.remove(tab.id!)
      }
    })
  }

  const onClick: React.EventHandler<any> = async (e) => {
    e.preventDefault()
    const data = await scrape()
    console.log(data)
  }

  return (
    <main className="flex flex-col w-full mb-4">
      <div className="flex items-center space-x-2 w-full mb-2 bg-[#CCCCFF] p-4">
        <LogoIcon className="w-8 h-8" />
        <h1 className="text-xl font-bold">Thrifty</h1>
      </div>
      <div className="flex items-center space-x-2 p-4">
        <form className="flex space-x-2 w-full" onSubmit={onClick}>
          <Input type="text" placeholder="Enter your search query" />
          <Button variant="default" type="submit">
            Search
          </Button>
        </form>
      </div>
      <div className="flex flex-col space-y-1.5 p-4">
        <h3 className="text-base font-semibold leading-none tracking-tight">Results</h3>
        <p className="text-sm text-muted-foreground">
          We have found following items that might interest you:
        </p>
        <div className="space-y-4 pt-2">
          <SearchResultItem name="eBay Kleinanzeigen (Germany)" itemsAmount={4} minPrice={18} />
          <SearchResultItem name="Leboncoin (France)" itemsAmount={2} minPrice={4} />
        </div>
      </div>
    </main>
  )
}

export default Popup
