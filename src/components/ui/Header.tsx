'use client'

import { ChevronLeft } from './Icons'

interface HeaderProps {
  showBack?: boolean
  onBack?: () => void
}

export default function Header({ showBack, onBack }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-center relative">
      {showBack && onBack && (
        <button
          onClick={onBack}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      <img src="/images/logo.png" alt="Cortiless Health" className="h-8" />
    </header>
  )
}
