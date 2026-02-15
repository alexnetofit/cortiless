'use client'

import { QuizStep } from '@/lib/quiz-config'

interface InfoStepProps {
  step: QuizStep
  onContinue: () => void
}

export default function InfoStep({ step, onContinue }: InfoStepProps) {
  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8">
      <div className="max-w-lg w-full mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold text-secondary mb-4">
          {step.title}
        </h2>

        {step.subtitle && (
          <p className="text-muted mb-6 leading-relaxed">
            {step.subtitle}
          </p>
        )}

        {step.image && (
          <div className="mb-6">
            <img
              src={step.image}
              alt=""
              className="w-full max-w-sm mx-auto rounded-xl shadow-md"
            />
          </div>
        )}

        {step.infoContent && (
          <div className="bg-accent rounded-xl p-6 mb-6 text-left">
            <p className="text-secondary font-semibold mb-4 text-center">
              {step.infoContent.text}
            </p>
            {step.infoContent.bullets && step.infoContent.bullets.length > 0 && (
              <ul className="space-y-3">
                {step.infoContent.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-lg">✅</span>
                    <span className="text-secondary">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

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
