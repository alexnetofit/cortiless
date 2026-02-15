'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/ui/Header'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const plan = searchParams.get('plan') || ''

  useEffect(() => {
    // Pre-fill email from quiz
    const quizEmail = sessionStorage.getItem('quiz_email')
    if (quizEmail) setEmail(quizEmail)
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // Create user profile
        const quizSessionId = sessionStorage.getItem('quiz_session_id')
        const quizAnswers = sessionStorage.getItem('quiz_answers')
        const answers = quizAnswers ? JSON.parse(quizAnswers) : {}

        // Calculate plan expiry
        const durationDays = plan === '1-month' ? 30 : plan === '3-month' ? 90 : 365
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + durationDays)

        // Extract data from quiz answers
        const weightData = answers['weight'] as Record<string, string> | undefined
        const desiredData = answers['desired-weight'] as Record<string, string> | undefined
        const heightData = answers['height'] as Record<string, string> | undefined
        const ageData = answers['age'] as Record<string, string> | undefined

        await supabase.from('user_profiles').insert({
          id: data.user.id,
          email,
          full_name: fullName,
          plan_type: plan || '3-month',
          plan_expires_at: expiresAt.toISOString(),
          quiz_session_id: quizSessionId,
          body_type: answers['current-body-type'] as string,
          target_body_type: answers['target-body-type'] as string,
          activity_level: answers['physical-activity'] as string,
          menopause_status: answers['menopause-status'] as string,
          weight_kg: weightData ? parseFloat(weightData.weight || '0') : null,
          target_weight_kg: desiredData ? parseFloat(desiredData.desired_weight || desiredData.weight || '0') : null,
          height_cm: heightData ? parseFloat(heightData.height_cm || '0') : null,
          age: ageData ? parseInt(ageData.age || '0') : null,
        })

        // Clear quiz data
        sessionStorage.removeItem('quiz_session_id')
        sessionStorage.removeItem('quiz_answers')
        sessionStorage.removeItem('quiz_current_step')
        sessionStorage.removeItem('quiz_email')

        router.push('/onboarding')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-secondary mb-2">
              Create Your Account
            </h1>
            <p className="text-muted">
              Set up your account to access your personalized program
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-accent border-2 border-gray-200 focus:border-primary rounded-xl px-4 py-3 text-secondary outline-none transition-all"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-accent border-2 border-gray-200 focus:border-primary rounded-xl px-4 py-3 text-secondary outline-none transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-accent border-2 border-gray-200 focus:border-primary rounded-xl px-4 py-3 text-secondary outline-none transition-all"
                placeholder="Min 6 characters"
                minLength={6}
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white font-semibold py-4 rounded-full transition-all duration-200 shadow-lg"
            >
              {loading ? 'Creating account...' : 'Create Account & Continue'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <a href="/auth/login" className="text-primary font-semibold hover:underline">
              Log in
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
