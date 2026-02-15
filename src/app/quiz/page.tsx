'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { QUIZ_STEPS, getTotalQuizSteps, getProgressStepNumber } from '@/lib/quiz-config'
import { supabase } from '@/lib/supabase'
import Header from '@/components/ui/Header'
import ProgressBar from '@/components/ui/ProgressBar'
import QuizStepRenderer from '@/components/quiz/QuizStepRenderer'

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('metric')

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      // Check if there's an existing session
      const existingId = sessionStorage.getItem('quiz_session_id')
      if (existingId) {
        setSessionId(existingId)
        // Load existing answers
        const savedAnswers = sessionStorage.getItem('quiz_answers')
        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers))
        }
        const savedStep = sessionStorage.getItem('quiz_current_step')
        if (savedStep) {
          setCurrentStep(parseInt(savedStep))
        }
        return
      }

      // Create new session
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
        sessionStorage.setItem('quiz_session_id', data.id)
      }

      // Load initial answer from landing
      const initialAnswer = sessionStorage.getItem('quiz_initial_answer')
      if (initialAnswer) {
        const initialAnswers = { 'weight-loss-goal': initialAnswer }
        setAnswers(initialAnswers)
        setCurrentStep(1) // Skip landing since they already answered
        sessionStorage.removeItem('quiz_initial_answer')
      }
    }

    initSession()
  }, [])

  // Save answers to sessionStorage and Supabase
  const saveAnswers = useCallback(async (newAnswers: Record<string, unknown>, step: number) => {
    sessionStorage.setItem('quiz_answers', JSON.stringify(newAnswers))
    sessionStorage.setItem('quiz_current_step', String(step))

    if (sessionId) {
      await supabase
        .from('quiz_sessions')
        .update({
          answers: newAnswers,
          current_step: step + 1,
        })
        .eq('id', sessionId)
    }
  }, [sessionId])

  const handleAnswer = useCallback((stepId: string, value: unknown) => {
    const newAnswers = { ...answers, [stepId]: value }
    setAnswers(newAnswers)

    const nextStep = currentStep + 1
    if (nextStep < QUIZ_STEPS.length) {
      setCurrentStep(nextStep)
      saveAnswers(newAnswers, nextStep)
    }
  }, [answers, currentStep, saveAnswers])

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      sessionStorage.setItem('quiz_current_step', String(prevStep))
    }
  }, [currentStep])

  const handleEmailSubmit = useCallback(async (email: string) => {
    const newAnswers = { ...answers, email }
    setAnswers(newAnswers)

    if (sessionId) {
      await supabase
        .from('quiz_sessions')
        .update({
          email,
          answers: newAnswers,
          current_step: currentStep + 1,
        })
        .eq('id', sessionId)
    }

    sessionStorage.setItem('quiz_email', email)
    setCurrentStep(currentStep + 1)
    saveAnswers(newAnswers, currentStep + 1)
  }, [answers, currentStep, sessionId, saveAnswers])

  const step = QUIZ_STEPS[currentStep]
  const totalProgressSteps = getTotalQuizSteps()
  const currentProgressStep = getProgressStepNumber(currentStep)

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
            onUnitSystemChange={setUnitSystem}
            sessionId={sessionId}
          />
        </AnimatePresence>
      </main>
    </div>
  )
}
