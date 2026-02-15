'use client'

import { useMemo } from 'react'
import { QuizStep } from '@/lib/quiz-config'

interface ResultsChartStepProps {
  step: QuizStep
  answers: Record<string, unknown>
  onContinue: () => void
}

export default function ResultsChartStep({ step, answers, onContinue }: ResultsChartStepProps) {
  const { currentWeight, targetWeight, unit } = useMemo(() => {
    const weightData = answers['weight'] as Record<string, string> | undefined
    const desiredData = answers['desired-weight'] as Record<string, string> | undefined
    const isImperial = weightData?.unit === 'imperial'

    let cw = isImperial ? 172 : 78
    let tw = isImperial ? 139 : 63

    if (weightData) {
      cw = parseFloat(weightData.weight || weightData.weight_lbs || String(cw))
    }

    if (desiredData) {
      tw = parseFloat(desiredData.desired_weight || desiredData.weight || String(tw))
    }

    const maxLoss = cw * 0.18
    const actualTarget = Math.max(tw, cw - maxLoss)

    return {
      currentWeight: Math.round(cw),
      targetWeight: Math.round(actualTarget * 10) / 10,
      unit: isImperial ? 'lbs' : 'kg',
    }
  }, [answers])

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
      <div className="max-w-lg w-full mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold text-secondary mb-2">
          {step.title}
        </h2>

        <p className="text-muted mb-4 text-sm">
          We estimate that you can potentially reach{' '}
          <span className="text-primary font-semibold">{targetWeight} {unit}</span>{' '}
          weight target.
        </p>

        {/* Chart with background image and dynamic numbers */}
        <div className="relative w-full max-w-[380px] mx-auto mb-4">
          <img
            src="/images/base-grafico-1.svg"
            alt="Weight chart"
            className="w-full h-auto"
          />
          {/* Current weight - centered in top-left pill */}
          <div
            className="absolute flex items-center justify-center"
            style={{ top: '19.15%', left: '2.56%', width: '23.75%', height: '11.93%' }}
          >
            <span className="text-[#299DE0] font-bold text-sm md:text-base">
              {currentWeight} {unit}
            </span>
          </div>
          {/* Target weight - centered in bottom-center pill */}
          <div
            className="absolute flex items-center justify-center"
            style={{ top: '66.65%', left: '27.78%', width: '23.75%', height: '11.93%' }}
          >
            <span className="text-[#299DE0] font-bold text-sm md:text-base">
              {targetWeight} {unit}
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
