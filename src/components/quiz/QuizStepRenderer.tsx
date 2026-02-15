'use client'

import { QuizStep } from '@/lib/quiz-config'
import { motion } from 'framer-motion'
import LandingStep from './steps/LandingStep'
import SocialProofStep from './steps/SocialProofStep'
import SingleSelectStep from './steps/SingleSelectStep'
import MultiSelectStep from './steps/MultiSelectStep'
import InfoStep from './steps/InfoStep'
import InputStep from './steps/InputStep'
import ResultsChartStep from './steps/ResultsChartStep'
import ResultsProgressStep from './steps/ResultsProgressStep'
import EmailCaptureStep from './steps/EmailCaptureStep'
import PricingStep from './steps/PricingStep'

interface QuizStepRendererProps {
  step: QuizStep
  answers: Record<string, unknown>
  onAnswer: (stepId: string, value: unknown) => void
  onEmailSubmit: (email: string) => void
  unitSystem: 'imperial' | 'metric'
  onUnitSystemChange: (system: 'imperial' | 'metric') => void
  sessionId: string | null
}

const stepAnimation = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.3, ease: 'easeInOut' as const },
}

export default function QuizStepRenderer({
  step,
  answers,
  onAnswer,
  onEmailSubmit,
  unitSystem,
  onUnitSystemChange,
  sessionId,
}: QuizStepRendererProps) {
  if (!step) return null

  const renderStep = () => {
    switch (step.type) {
      case 'landing':
        return (
          <LandingStep
            step={step}
            onAnswer={(value) => onAnswer(step.id, value)}
          />
        )
      case 'social-proof':
        return (
          <SocialProofStep
            step={step}
            onContinue={() => onAnswer(step.id, 'viewed')}
          />
        )
      case 'single-select':
        return (
          <SingleSelectStep
            step={step}
            onAnswer={(value) => onAnswer(step.id, value)}
          />
        )
      case 'multi-select':
        return (
          <MultiSelectStep
            step={step}
            onAnswer={(value) => onAnswer(step.id, value)}
          />
        )
      case 'info':
        return (
          <InfoStep
            step={step}
            onContinue={() => onAnswer(step.id, 'viewed')}
          />
        )
      case 'input':
        return (
          <InputStep
            step={step}
            answers={answers}
            onAnswer={(value) => onAnswer(step.id, value)}
            unitSystem={unitSystem}
            onUnitSystemChange={onUnitSystemChange}
          />
        )
      case 'results-chart':
        return (
          <ResultsChartStep
            step={step}
            answers={answers}
            onContinue={() => onAnswer(step.id, 'viewed')}
          />
        )
      case 'results-progress':
        return (
          <ResultsProgressStep
            step={step}
            answers={answers}
            onContinue={() => onAnswer(step.id, 'viewed')}
          />
        )
      case 'email-capture':
        return (
          <EmailCaptureStep
            step={step}
            savedEmail={typeof localStorage !== 'undefined' ? localStorage.getItem('quiz_email') || '' : ''}
            onSubmit={onEmailSubmit}
          />
        )
      case 'pricing':
        return (
          <PricingStep
            step={step}
            answers={answers}
            sessionId={sessionId}
          />
        )
      default:
        return <div>Unknown step type</div>
    }
  }

  return (
    <motion.div
      key={step.id}
      initial={stepAnimation.initial}
      animate={stepAnimation.animate}
      exit={stepAnimation.exit}
      transition={stepAnimation.transition}
      className="flex-1 flex flex-col"
    >
      {renderStep()}
    </motion.div>
  )
}
