import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Box, MenuIcon, X } from 'lucide-react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Características', href: '#features' },
    // { name: 'Precios', href: '#pricing' },
    { name: 'Recursos', href: '#resources' }
    // { name: 'Contacto', href: '#contact' }
  ]

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amaranth-500 rounded-lg">
              <Box size={20} color="#fff" />
            </div>
            <span className="text-xl font-bold text-amaranth-950">
              Bodegapp Pro
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/signin"
              className="cursor-pointer text-sm font-semibold hover:bg-amaranth-100 rounded-xl text-amaranth-950 py-3 px-3"
            >
              Iniciar Sesión
            </Link>
            <Link
              className="cursor-pointer text-sm font-semibold hover:shadow-amaranth-lg/40 bg-amaranth-600 text-white rounded-xl py-3 px-4"
              to="/signup"
            >
              Comienza gratis
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                <Link
                  to="/signin"
                  className="cursor-pointer text-center text-sm font-semibold hover:bg-amaranth-100 rounded-xl text-amaranth-950 py-3 px-3"
                >
                  Iniciar sesión
                </Link>
                <Link
                  className="cursor-pointer text-center text-sm font-semibold hover:shadow-amaranth-lg/40 bg-amaranth-600 text-white rounded-xl py-3 px-4"
                  to="/signup"
                >
                  Comenzar gratis
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
