import { Button, Avatar, AvatarFallback, Separator } from '@/components/ui'
import { Currency, Platform, formatCurrency, toDisplayName } from '@/lib'
import { ChevronRight } from 'lucide-react'

export const SearchResultItem = ({
  platform,
  itemsAmount,
  minPrice,
  onButtonClick,
}: {
  platform: Platform
  itemsAmount: number
  minPrice: number | null
  onButtonClick(): void
}) => (
  <div className="flex items-center space-x-4 rounded-lg space-y-1 leading-none w-full">
    <div className="flex-shrink-0">
      <Avatar>
        <AvatarFallback>{platform.name.slice(0, 2)}</AvatarFallback>
      </Avatar>
    </div>
    <div className="flex-grow">
      <h2 className="text-sm font-semibold">{toDisplayName(platform)}</h2>
      <p className="text-sm text-gray-500">
        {itemsAmount} Items found
        {minPrice !== null ? ` from ${formatCurrency(minPrice, platform.currency)}` : ''}
      </p>
    </div>
    <div className="flex-shrink-0">
      <Button variant="secondary" size="icon" onClick={onButtonClick}>
        <ChevronRight />
      </Button>
    </div>
  </div>
)
