'use client'

import { QuizStep } from '@/lib/quiz-config'

interface SingleSelectStepProps {
  step: QuizStep
  onAnswer: (value: string) => void
}

export default function SingleSelectStep({ step, onAnswer }: SingleSelectStepProps) {
  const hasImages = step.options?.some(o => o.image)

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8">
      <div className="max-w-lg w-full mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-secondary text-center mb-8">
          {step.title}
        </h2>

        <div className="flex flex-col gap-3">
          {step.options?.map((option) => (
            <button
              key={option.id}
              onClick={() => onAnswer(option.id)}
              className={`group w-full bg-accent hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 rounded-2xl flex items-center justify-between transition-all duration-200 active:scale-[0.98] overflow-hidden ${
                hasImages ? 'px-0 min-h-[80px]' : 'px-5 py-4'
              }`}
            >
              <div className="flex items-center gap-3">
                {hasImages && option.image && (
                  <img
                    src={option.image}
                    alt={option.label}
                    className="w-20 h-full object-cover object-top self-stretch"
                  />
                )}
                {!hasImages && null}
                <span className={`text-secondary font-medium text-lg ${hasImages ? '' : ''}`}>
                  {option.label}
                </span>
              </div>
              {option.emoji && (
                <span className="text-2xl pr-5">{option.emoji}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
