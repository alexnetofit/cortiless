'use client'

import { useMemo } from 'react'
import { QuizStep } from '@/lib/quiz-config'

interface ResultsChartStepProps {
  step: QuizStep
  answers: Record<string, unknown>
  onContinue: () => void
}

export default function ResultsChartStep({ step, answers, onContinue }: ResultsChartStepProps) {
  const { currentWeight, targetWeight } = useMemo(() => {
    const weightData = answers['weight'] as Record<string, string> | undefined
    const desiredData = answers['desired-weight'] as Record<string, string> | undefined

    let cw = 78 // default
    let tw = 63 // default

    if (weightData) {
      const val = parseFloat(weightData.weight || weightData.weight_lbs || '78')
      if (weightData.unit === 'imperial') {
        cw = Math.round(val * 0.453592)
      } else {
        cw = val
      }
    }

    if (desiredData) {
      const val = parseFloat(desiredData.desired_weight || desiredData.weight || '63')
      if (desiredData.unit === 'imperial') {
        tw = Math.round(val * 0.453592)
      } else {
        tw = val
      }
    }

    // Ensure target is achievable (max 18% loss in 12 weeks)
    const maxLoss = cw * 0.18
    const actualTarget = Math.max(tw, cw - maxLoss)

    return { currentWeight: cw, targetWeight: Math.round(actualTarget * 10) / 10 }
  }, [answers])

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8">
      <div className="max-w-lg w-full mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold text-secondary mb-3">
          {step.title}
        </h2>

        <p className="text-muted mb-6">
          We estimate that you can potentially reach{' '}
          <span className="text-primary font-semibold">{targetWeight} kg</span>{' '}
          weight target.
        </p>

        {/* Chart with background image and dynamic numbers */}
        <div className="relative w-full max-w-[440px] mx-auto mb-8">
          <img
            src="/images/base-grafico-1.svg"
            alt="Weight chart"
            className="w-full h-auto"
          />
          {/* Current weight - positioned over top-left pill */}
          <div className="absolute top-[21%] left-[6%] w-[23%] flex items-center justify-center">
            <span className="text-[#299DE0] font-bold text-sm md:text-base">
              {currentWeight} kg
            </span>
          </div>
          {/* Target weight - positioned over bottom-center pill */}
          <div className="absolute top-[70%] left-[30%] w-[23%] flex items-center justify-center">
            <span className="text-[#299DE0] font-bold text-sm md:text-base">
              {targetWeight} kg
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
