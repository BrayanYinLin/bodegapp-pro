import { Ghost } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Ghost height={60} />
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
    </div>
  )
}
