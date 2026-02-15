'use client'

import { useState } from 'react'
import { QuizStep } from '@/lib/quiz-config'
import { CheckIcon } from '@/components/ui/Icons'

interface MultiSelectStepProps {
  step: QuizStep
  onAnswer: (value: string[]) => void
}

export default function MultiSelectStep({ step, onAnswer }: MultiSelectStepProps) {
  const [selected, setSelected] = useState<string[]>([])
  const hasImages = step.options?.some(o => o.image)

  const toggleOption = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8">
      <div className="max-w-lg w-full mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-secondary text-center mb-2">
          {step.title}
        </h2>
        {step.subtitle && (
          <p className="text-muted text-center mb-6">{step.subtitle}</p>
        )}

        <div className="flex flex-col gap-3 mb-6">
          {step.options?.map((option) => {
            const isSelected = selected.includes(option.id)
            return (
              <button
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className={`w-full rounded-2xl px-5 flex items-center justify-between transition-all duration-200 active:scale-[0.98] border-2 overflow-hidden ${
                  hasImages ? 'py-0 min-h-[80px]' : 'py-4'
                } ${
                  isSelected
                    ? 'bg-primary/10 border-primary'
                    : 'bg-accent border-transparent hover:border-primary/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected ? 'bg-primary border-primary' : 'border-gray-300'
                  }`}>
                    {isSelected && <CheckIcon className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-secondary font-medium">
                    {option.label}
                  </span>
                </div>
                <div className="flex items-end self-end gap-2">
                  {option.emoji && <span className="text-2xl py-4">{option.emoji}</span>}
                  {hasImages && option.image && (
                    <img
                      src={option.image}
                      alt={option.label}
                      className="w-20 h-20 object-cover object-top"
                    />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <button
          onClick={() => onAnswer(selected)}
          disabled={selected.length === 0}
          className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/40 text-white font-semibold py-4 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg disabled:shadow-none disabled:hover:scale-100"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
