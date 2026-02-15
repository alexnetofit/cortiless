'use client'

import { QuizStep } from '@/lib/quiz-config'

interface LandingStepProps {
  step: QuizStep
  onAnswer: (value: string) => void
}

export default function LandingStep({ step, onAnswer }: LandingStepProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 bg-accent">
      <div className="max-w-lg w-full mx-auto text-center">
        <h1 className="text-2xl md:text-4xl font-black text-secondary leading-tight mb-8">
          {step.title.split('\n').map((line, i) => (
            <span key={i} className="bg-primary/90 text-white px-3 py-1 inline-block mb-2">
              {line}
            </span>
          ))}
        </h1>

        <p className="text-lg text-secondary font-medium mb-6">
          {step.subtitle}
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {step.options?.map((option) => (
            <button
              key={option.id}
              onClick={() => onAnswer(option.id)}
              className="bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
