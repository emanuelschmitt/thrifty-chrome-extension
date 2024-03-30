import { Button, Avatar, AvatarFallback } from '@/components/ui'
import { ExternalLink } from 'lucide-react'

export const SearchResultItem = ({
  name,
  itemsAmount,
  minPrice,
  onButtonClick,
}: {
  name: string
  itemsAmount: number
  minPrice: string
  onButtonClick(): void
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
        {itemsAmount} Items found from {minPrice}
      </p>
    </div>
    <div className="flex-shrink-0">
      <Button variant="secondary" size="icon" onClick={onButtonClick}>
        <ExternalLink />
      </Button>
    </div>
  </div>
)
