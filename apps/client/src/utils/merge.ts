import { clsx, type ClassValue } from 'clsx'

export function merge(...inputs: ClassValue[]) {
  return clsx(inputs)
}
