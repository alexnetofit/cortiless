'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { QUIZ_STEPS, getTotalQuizSteps, getProgressStepNumber } from '@/lib/quiz-config'
import { supabase } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import ProgressBar from '@/components/ui/ProgressBar'
import QuizStepRenderer from '@/components/quiz/QuizStepRenderer'

// Use localStorage for persistence across refreshes/tab closes
function store(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* ignore */ }
}
function load(key: string): string | null {
  try { return localStorage.getItem(key) } catch { return null }
}
function remove(key: string) {
  try { localStorage.removeItem(key) } catch { /* ignore */ }
}

// Helper: get step index from URL slug
function getStepFromSlug(slug: string | null): number {
  if (!slug) return 0
  const index = QUIZ_STEPS.findIndex(s => s.id === slug)
  return index >= 0 ? index : 0
}

// Helper: update URL without full navigation
function updateUrl(stepIndex: number, replace = false) {
  const stepId = QUIZ_STEPS[stepIndex]?.id || 'start'
  const url = `/quiz/${stepId}`
  if (replace) {
    window.history.replaceState({ step: stepIndex }, '', url)
  } else {
    window.history.pushState({ step: stepIndex }, '', url)
  }
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('metric')
  const [ready, setReady] = useState(false)

  // Initialize: URL slug determines current step, localStorage restores answers
  useEffect(() => {
    const initSession = async () => {
      try {
        // Determine step from URL slug
        const pathParts = window.location.pathname.split('/')
        const urlSlug = pathParts.length >= 3 ? pathParts[2] : null
        const stepIndex = urlSlug ? getStepFromSlug(urlSlug) : 0

        setCurrentStep(stepIndex)
        window.history.replaceState({ step: stepIndex }, '', window.location.pathname)

        // Restore cached answers (input values like weight, height, email, etc.)
        const savedAnswers = load('quiz_answers')
        if (savedAnswers) {
          try { setAnswers(JSON.parse(savedAnswers)) } catch { /* ignore */ }
        }

        // Restore unit system
        const savedUnit = load('quiz_unit_system')
        if (savedUnit === 'imperial' || savedUnit === 'metric') setUnitSystem(savedUnit)

        // Restore session ID
        const existingId = load('quiz_session_id')
        if (existingId) setSessionId(existingId)

        // Check if coming from landing page with initial answer
        const initialAnswer = load('quiz_initial_answer')
        if (initialAnswer) {
          const initialAnswers = { 'weight-loss-goal': initialAnswer }
          setAnswers(initialAnswers)
          setCurrentStep(1)
          remove('quiz_initial_answer')
          store('quiz_answers', JSON.stringify(initialAnswers))
          updateUrl(1, true)
        } else if (!urlSlug) {
          updateUrl(0, true)
        }

        // Try to create DB session if none exists (non-blocking)
        if (!existingId) {
          try {
            const urlParams = new URLSearchParams(window.location.search)
            const { data, error } = await supabase
              .from('quiz_sessions')
              .insert({
                utm_source: urlParams.get('utm_source'),
                utm_medium: urlParams.get('utm_medium'),
                utm_campaign: urlParams.get('utm_campaign'),
              })
              .select('id')
              .single()

            if (!error && data) {
              setSessionId(data.id)
              store('quiz_session_id', data.id)
            }
          } catch {
            console.warn('Could not create quiz session in DB')
          }
        }
      } catch {
        console.warn('Quiz init error - continuing without DB')
      }
      setReady(true)
    }

    initSession()
  }, [])

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const stepIndex = event.state?.step
      if (typeof stepIndex === 'number' && stepIndex >= 0 && stepIndex < QUIZ_STEPS.length) {
        setCurrentStep(stepIndex)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Save answers to localStorage and Supabase
  const saveAnswers = useCallback(async (newAnswers: Record<string, unknown>, step: number) => {
    store('quiz_answers', JSON.stringify(newAnswers))

    if (sessionId) {
      try {
        await supabase
          .from('quiz_sessions')
          .update({
            answers: newAnswers,
            current_step: step + 1,
          })
          .eq('id', sessionId)
      } catch { /* non-blocking */ }
    }
  }, [sessionId])

  const handleAnswer = useCallback((stepId: string, value: unknown) => {
    const newAnswers = { ...answers, [stepId]: value }
    setAnswers(newAnswers)

    const nextStep = currentStep + 1
    if (nextStep < QUIZ_STEPS.length) {
      setCurrentStep(nextStep)
      saveAnswers(newAnswers, nextStep)
      updateUrl(nextStep)
    }
  }, [answers, currentStep, saveAnswers])

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      window.history.back()
    }
  }, [currentStep])

  const handleEmailSubmit = useCallback(async (email: string) => {
    const newAnswers = { ...answers, email }
    setAnswers(newAnswers)

    if (sessionId) {
      try {
        await supabase
          .from('quiz_sessions')
          .update({
            email,
            answers: newAnswers,
            current_step: currentStep + 1,
          })
          .eq('id', sessionId)
      } catch { /* non-blocking */ }
    }

    store('quiz_email', email)
    const nextStep = currentStep + 1
    setCurrentStep(nextStep)
    saveAnswers(newAnswers, nextStep)
    updateUrl(nextStep)
  }, [answers, currentStep, sessionId, saveAnswers])

  const step = QUIZ_STEPS[currentStep]
  const totalProgressSteps = getTotalQuizSteps()
  const currentProgressStep = getProgressStepNumber(currentStep)

  if (!ready) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showBack={currentStep > 0} onBack={handleBack} />

      {!step?.skipProgress && (
        <ProgressBar current={currentProgressStep} total={totalProgressSteps} />
      )}

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <QuizStepRenderer
            key={step?.id}
            step={step}
            answers={answers}
            onAnswer={handleAnswer}
            onEmailSubmit={handleEmailSubmit}
            unitSystem={unitSystem}
            onUnitSystemChange={(system) => { setUnitSystem(system); store('quiz_unit_system', system) }}
            sessionId={sessionId}
          />
        </AnimatePresence>
      </main>
    </div>
  )
}
