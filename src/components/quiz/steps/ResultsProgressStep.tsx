'use client'

import { useMemo } from 'react'
import { QuizStep } from '@/lib/quiz-config'

interface ResultsProgressStepProps {
  step: QuizStep
  answers: Record<string, unknown>
  onContinue: () => void
}

export default function ResultsProgressStep({ step, answers, onContinue }: ResultsProgressStepProps) {
  const estimatedLoss = useMemo(() => {
    const weightData = answers['weight'] as Record<string, string> | undefined
    let cw = 78
    if (weightData) {
      const val = parseFloat(weightData.weight || '78')
      if (weightData.unit === 'imperial') {
        cw = Math.round(val * 0.453592)
      } else {
        cw = val
      }
    }
    // Estimate 2-4% loss in first week
    return Math.round(cw * 0.038)
  }, [answers])

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8">
      <div className="max-w-lg w-full mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold text-secondary mb-3">
          {step.title}
        </h2>

        <p className="text-muted mb-8">
          {step.subtitle}
        </p>

        {/* Progress visualization */}
        <div className="bg-accent rounded-2xl p-6 mb-8">
          {/* Weight loss bubble */}
          <div className="relative mb-8">
            <div className="inline-block border-2 border-teal-400 rounded-2xl px-8 py-3">
              <span className="text-3xl font-bold text-teal-500">-{estimatedLoss} kg</span>
            </div>
            {/* Connector line */}
            <svg className="w-full h-16 mt-2" viewBox="0 0 300 60">
              <path d="M 150 0 Q 250 0 260 30 Q 270 55 260 55" fill="none" stroke="#5eead4" strokeWidth="2" />
            </svg>
          </div>

          {/* Progress bar */}
          <div className="relative mb-4">
            <div className="h-10 bg-gradient-to-r from-green-400 via-green-500 to-green-700 rounded-full flex items-center px-2">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-6 mx-0.5 rounded-full bg-white/20"
                />
              ))}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
            </div>
          </div>

          {/* Labels */}
          <div className="flex justify-between text-sm text-muted px-2">
            <span>Normal</span>
            <span>Good</span>
            <span>Great</span>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full max-w-sm bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
