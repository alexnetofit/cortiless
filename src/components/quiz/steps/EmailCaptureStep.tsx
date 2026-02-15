'use client'

import { useState } from 'react'
import { QuizStep } from '@/lib/quiz-config'

interface EmailCaptureStepProps {
  step: QuizStep
  onSubmit: (email: string) => void
}

export default function EmailCaptureStep({ step, onSubmit }: EmailCaptureStepProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const handleSubmit = () => {
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    setError('')
    onSubmit(email)
  }

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8">
      <div className="max-w-lg w-full mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold text-secondary mb-1">
          {step.title}
        </h2>
        <p className="text-xl md:text-2xl font-bold text-primary mb-8">
          {step.subtitle}
        </p>

        {/* Email input */}
        <div className="mb-6">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-accent border-2 border-gray-200 focus:border-primary rounded-full px-6 py-4 text-secondary text-lg outline-none transition-all"
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Social proof */}
        <div className="bg-accent rounded-xl p-4 mb-6">
          <p className="text-2xl font-bold text-primary">1,877,381</p>
          <p className="text-secondary font-medium">women have already joined</p>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full max-w-sm bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg mb-4"
        >
          Continue
        </button>

        <p className="text-xs text-muted max-w-sm mx-auto">
          By clicking &quot;Continue&quot; below you acknowledge that you have read, understood and accepted the{' '}
          <a href="#" className="text-primary underline">Terms of Service</a> and{' '}
          <a href="#" className="text-primary underline">Privacy Policy</a> and you agree to receive future emails from us about our weight loss program.
        </p>
      </div>
    </div>
  )
}
