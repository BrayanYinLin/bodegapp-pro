import { cva } from 'class-variance-authority'

import { merge } from '@/utils/merge'
import { type ReactNode } from 'react'

const styles = {
  variants: {
    variant: {
      default: 'bg-amaranth-600 text-white hover:bg-primary/90',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-white hover:bg-amaranth-300',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      link: 'text-primary underline-offset-4 hover:underline'
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
} as const

export const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  styles
)

type ButtonProps = {
  children: ReactNode
  className?: string
  variant: string
  onClick?: () => void
}

export const Button = ({ className = '', variant, children }: ButtonProps) => {
  return <button className={merge(className, variant)}>{children}</button>
}
