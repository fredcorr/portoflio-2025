import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge about the project's custom font-size tokens
// (text-body-*, text-heading-*) so they don't conflict with text-color classes.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['body-xl', 'body-lg', 'body-md', 'heading-1', 'heading-2', 'heading-3', 'heading-4', 'heading-5', 'heading-6'] },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
