import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Country } from './model'

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
    default:
      return '🏴‍☠️'
  }
}
