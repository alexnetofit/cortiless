'use client'

import { useMemo } from 'react'
import { QuizStep } from '@/lib/quiz-config'

interface ResultsProgressStepProps {
  step: QuizStep
  answers: Record<string, unknown>
  onContinue: () => void
}

export default function ResultsProgressStep({ step, answers, onContinue }: ResultsProgressStepProps) {
  const { estimatedLoss, unit } = useMemo(() => {
    const weightData = answers['weight'] as Record<string, string> | undefined
    const isImperial = weightData?.unit === 'imperial'

    if (isImperial) {
      return { estimatedLoss: 6, unit: 'lbs' }
    }
    return { estimatedLoss: 3, unit: 'kg' }
  }, [answers])

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
      <div className="max-w-lg w-full mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold text-secondary mb-2">
          {step.title}
        </h2>

        <p className="text-muted mb-4 text-sm">
          {step.subtitle}
        </p>

        {/* Chart with background image and dynamic value */}
        <div className="relative w-full max-w-[380px] mx-auto mb-4">
          <img
            src="/images/base-grafico-2.avif"
            alt="7-day results"
            className="w-full h-auto rounded-2xl"
          />
          {/* Weight loss value - centered in the bubble */}
          <div
            className="absolute flex items-center justify-center"
            style={{ top: '8%', left: '18%', width: '52%', height: '22%' }}
          >
            <span className="text-[#299DE0] font-bold text-2xl md:text-3xl">
              -{estimatedLoss} {unit}
            </span>
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
