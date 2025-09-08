import { Box } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white rounded-lg shadow-sm m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="p-2 bg-amaranth-500 rounded-lg">
              <Box size={16} color="#fff" />
            </div>
            <span className="text-lg font-bold text-amaranth-950">
              Bodegapp Pro
            </span>
          </div>

          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <span className="block text-sm sm:text-center">
          © 2023{' '}
          <a href="https://flowbite.com/" className="hover:underline">
            Bogegapp™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  )
}
