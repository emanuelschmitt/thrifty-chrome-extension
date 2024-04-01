import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Country, Currency } from './model'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toCountryEmoji = (country: Country) => {
  switch (country) {
    case 'Germany':
      return '🇩🇪'
    case 'France':
      return '🇫🇷'
    case 'Spain':
      return '🇪🇸'
    case 'Italy':
      return '🇮🇹'
    case 'United Kingdom':
      return '🇬🇧'
    case 'Denmark':
      return '🇩🇰'
    case 'Austria':
      return '🇦🇹'
    case 'Netherlands':
      return '🇳🇱'
    default:
      return '🏴‍☠️'
  }
}

export const formatCurrency = (amount: number, currency: Currency) => {
  if (currency === 'DKK') {
    return amount + ' ' + currency
  }

  return (amount / 100).toFixed(2) + ' ' + currency
}
