import React from 'react'
import { LogoIcon } from '@/components/ui'

export const Layout = ({ children }: React.PropsWithChildren) => (
  <main className="flex flex-col w-full mb-4">
    <div className="flex items-center space-x-2 w-full mb-2 bg-[#CCCCFF] p-4">
      <LogoIcon className="w-8 h-8" />
      <h1 className="text-xl font-bold">Thrifty</h1>
    </div>
    {children}
  </main>
)
