'use client'

import { useState } from 'react'
import { QuizStep } from '@/lib/quiz-config'

interface InputStepProps {
  step: QuizStep
  onAnswer: (value: Record<string, string>) => void
  unitSystem: 'imperial' | 'metric'
  onUnitSystemChange: (system: 'imperial' | 'metric') => void
}

export default function InputStep({ step, onAnswer, unitSystem, onUnitSystemChange }: InputStepProps) {
  const [values, setValues] = useState<Record<string, string>>({})
  const config = step.inputConfig

  if (!config) return null

  const isMetric = unitSystem === 'metric'

  // Get fields based on unit system
  const getFields = () => {
    if (!config.hasUnitToggle) return config.fields

    if (step.id === 'height') {
      if (isMetric) {
        return [{ name: 'height_cm', label: 'Height', placeholder: 'Height', suffix: 'cm', type: 'number' }]
      }
      return config.fields // ft and in
    }

    if (step.id === 'weight' || step.id === 'desired-weight') {
      if (isMetric) {
        return config.fields // already kg
      }
      return [{ name: config.fields[0].name, label: config.fields[0].label, placeholder: config.fields[0].placeholder, suffix: 'lbs', type: 'number' }]
    }

    return config.fields
  }

  const fields = getFields()

  const isValid = fields.every(f => values[f.name] && values[f.name].trim() !== '')

  const handleSubmit = () => {
    if (!isValid) return
    onAnswer({ ...values, unit: unitSystem })
  }

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-8">
      <div className="max-w-lg w-full mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold text-secondary mb-3">
          {step.title}
        </h2>

        {step.subtitle && (
          <p className="text-muted mb-6 text-sm leading-relaxed">
            {step.subtitle}
          </p>
        )}

        {/* Unit toggle */}
        {config.hasUnitToggle && (
          <div className="flex justify-center mb-6">
            <div className="bg-accent rounded-full p-1 flex gap-1">
              <button
                onClick={() => onUnitSystemChange('imperial')}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  !isMetric ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-secondary'
                }`}
              >
                Imperial
              </button>
              <button
                onClick={() => onUnitSystemChange('metric')}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  isMetric ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-secondary'
                }`}
              >
                Metric
              </button>
            </div>
          </div>
        )}

        {/* Input fields */}
        <div className="flex gap-3 justify-center mb-8">
          {fields.map((field) => (
            <div key={field.name} className="relative flex-1 max-w-[200px]">
              <input
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={values[field.name] || ''}
                onChange={(e) => setValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                className="w-full bg-accent border-2 border-gray-200 focus:border-primary rounded-xl px-4 py-4 pr-12 text-secondary text-lg outline-none transition-all"
              />
              {field.suffix && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm">
                  {field.suffix}
                </span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full max-w-sm bg-primary hover:bg-primary-dark disabled:bg-primary/40 text-white font-semibold py-4 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg disabled:shadow-none disabled:hover:scale-100"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
