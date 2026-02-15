'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DropletIcon, ScaleIcon, UtensilsIcon } from '@/components/ui/Icons'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: '🏠' },
    { href: '/dashboard/plan', label: 'Meal Plan', iconComponent: UtensilsIcon },
    { href: '/dashboard/progress', label: 'Progress', iconComponent: ScaleIcon },
    { href: '/dashboard/water', label: 'Water', iconComponent: DropletIcon },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white text-xs font-bold rounded-md px-1.5 py-0.5">CL</div>
          <span className="font-semibold text-secondary text-lg">Health</span>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-secondary md:hidden"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:text-secondary hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => {
              // Will handle logout
              import('@/lib/supabase').then(({ supabase }) => supabase.auth.signOut())
            }}
            className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            Logout
          </Link>
        </nav>
      </header>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-b border-gray-100 px-4 py-2 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:text-secondary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Content */}
      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom nav - mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 flex justify-around z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs ${
                isActive ? 'text-primary' : 'text-muted'
              }`}
            >
              <span className="text-lg">{item.icon || '📋'}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
