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

        <p className="text-muted mb-8">
          We estimate that you can potentially reach{' '}
          <span className="text-primary font-semibold">{targetWeight} kg</span>{' '}
          weight target.
        </p>

        {/* Weight chart visualization */}
        <div className="bg-accent rounded-2xl p-6 mb-8">
          <p className="text-secondary font-semibold mb-6">Your achievable weight:</p>

          <div className="relative h-48">
            {/* Starting weight */}
            <div className="absolute left-[10%] top-2">
              <div className="bg-primary/10 border-2 border-primary text-primary font-bold px-4 py-1.5 rounded-full text-sm">
                {currentWeight} kg
              </div>
            </div>

            {/* SVG Chart */}
            <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
              {/* Dashed vertical lines */}
              <line x1="60" y1="35" x2="60" y2="130" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="280" y1="35" x2="280" y2="130" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="1" />

              {/* Weight loss curve */}
              <path
                d="M 40 40 Q 100 40 160 80 Q 220 115 280 120"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Maintenance line */}
              <path
                d="M 280 120 Q 330 118 380 120"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Starting red line */}
              <line x1="20" y1="40" x2="40" y2="40" stroke="#ef4444" strokeWidth="3" />

              {/* Circle at target */}
              <circle cx="280" cy="120" r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
            </svg>

            {/* Target weight */}
            <div className="absolute left-[55%] bottom-0 -translate-x-1/2">
              <div className="bg-blue-50 border-2 border-blue-400 text-blue-600 font-bold px-4 py-1.5 rounded-full text-sm">
                {targetWeight} kg
              </div>
            </div>

            {/* Labels */}
            <div className="absolute left-[10%] bottom-[-8px] text-xs text-muted">W1</div>
            <div className="absolute left-[65%] bottom-[-8px] text-xs text-muted">W12</div>

            {/* Annotation */}
            <div className="absolute right-4 bottom-2 text-xs text-muted flex items-center gap-1">
              <span>→</span>
              <span>The weight<br />stays off!</span>
            </div>

            <div className="absolute left-[55%] top-[45%] text-xs text-muted">
              <span>↓</span>
              <span className="ml-1">Your weight after<br />12 weeks</span>
            </div>
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
