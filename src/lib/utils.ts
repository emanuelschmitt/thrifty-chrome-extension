import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Country, Currency, Platform } from './model'

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
    case 'Sweden':
      return '🇸🇪'
    case 'Norway':
      return '🇳🇴'
    default:
      return '🏴‍☠️'
  }
}

export const formatCurrency = (amount: number, currency: Currency) => {
  const nonMinorCurrencies: Currency[] = ['DKK', 'SEK', 'NOK']
  if (nonMinorCurrencies.includes(currency)) {
    return amount + ' ' + currency
  }
  return (amount / 100).toFixed(2) + ' ' + currency
}

export const toDisplayName = (platform: Platform) => {
  return `${platform.name} ${toCountryEmoji(platform.country)}`
}
