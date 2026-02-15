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
      <div className="flex items-center gap-2">
        <div className="bg-primary text-white text-xs font-bold rounded-md px-1.5 py-0.5">
          CL
        </div>
        <span className="font-semibold text-secondary text-lg">Health</span>
      </div>
    </header>
  )
}
