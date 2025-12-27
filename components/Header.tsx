import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * Header Component - Glassmorphic Navigation
 * 
 * Features:
 * - Fixed position with glassmorphic background
 * - Logo: Globe emoji + company name with gradient text
 * - Navigation with animated gradient underlines
 * - Responsive hamburger menu for mobile
 * - Orange gradient CTA "Get Quote" button
 */
export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '#services' },
    { label: 'Products', href: '#products' },
    { label: 'Packaging', href: '#packaging' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      if (router.pathname !== '/') {
        router.push('/').then(() => {
          setTimeout(() => {
            const element = document.getElementById(href.replace('#', ''))
            element?.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        })
      } else {
        const element = document.getElementById(href.replace('#', ''))
        element?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      router.push(href)
    }
    setIsOpen(false)
  }

  return (
    <header className="fixed w-full top-0 z-50 py-1 px-4">
      {/* Glassmorphic container */}
      <div className="glass max-w-7xl mx-auto">
        <nav className="flex items-center justify-between px-4 py-1">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="text-2xl">🌍</div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Export Business</p>
              <h1 className="gradient-text font-bold text-sm">Komodki Impex</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="nav-link text-gray-800 font-medium hover:text-orange-600"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA Button + Mobile Menu */}
          <div className="flex items-center gap-3">
            <button className="btn-orange hidden md:inline-flex gap-2 px-4 py-2">
              Get Quote
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-white/50 rounded-lg transition-colors duration-300"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-800" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-white/20 px-4 py-3 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="block nav-link text-gray-800 font-medium py-2 hover:text-orange-600 w-full text-left"
              >
                {link.label}
              </button>
            ))}
            <button className="btn-orange w-full mt-4">Get Quote</button>
          </div>
        )}
      </div>
    </header>
  )
}