export type StepType =
  | 'landing'
  | 'social-proof'
  | 'single-select'
  | 'multi-select'
  | 'info'
  | 'input'
  | 'results-chart'
  | 'results-progress'
  | 'email-capture'
  | 'pricing'

export interface QuizOption {
  id: string
  label: string
  emoji?: string
  image?: string
}

export interface QuizStep {
  id: string
  type: StepType
  title: string
  subtitle?: string
  options?: QuizOption[]
  image?: string
  infoContent?: {
    text: string
    bullets?: string[]
  }
  inputConfig?: {
    fields: {
      name: string
      label: string
      placeholder: string
      suffix?: string
      type?: string
    }[]
    hasUnitToggle?: boolean
    units?: { imperial: string; metric: string }
  }
  autoAdvance?: boolean
  skipProgress?: boolean
}

export const QUIZ_STEPS: QuizStep[] = [
  // Step 1: Landing
  {
    id: 'weight-loss-goal',
    type: 'landing',
    title: 'CORTISOL CLEANSE:\nLOSE WEIGHT IN ANY\nMENOPAUSE STAGE',
    subtitle: 'How much weight would you like to lose?',
    options: [
      { id: '0-10', label: '0-10 lbs' },
      { id: '10-20', label: '10-20 lbs' },
      { id: '20-40', label: '20-40 lbs' },
      { id: '40+', label: '40+ lbs' },
    ],
    skipProgress: true,
  },

  // Step 2: Social proof
  {
    id: 'social-proof-1',
    type: 'social-proof',
    title: '1,877,381',
    subtitle: 'women have already joined',
    image: '/images/tela-2.png',
    infoContent: {
      text: 'Designed to support healthy cortisol levels for women over 40',
      bullets: [],
    },
  },

  // Step 3: Cortisol knowledge
  {
    id: 'cortisol-knowledge',
    type: 'single-select',
    title: 'How much do you know about cortisol?',
    options: [
      { id: 'nothing', label: 'Nothing at all', emoji: '🙄' },
      { id: 'basic', label: 'Basic understanding', emoji: '🙂' },
      { id: 'a-lot', label: 'I know a lot', emoji: '🤓' },
    ],
  },

  // Step 4: Cortisol info
  {
    id: 'cortisol-info',
    type: 'info',
    title: "Cortisol is your body's main stress hormone",
    subtitle: 'When it stays too high for too long, it can cause stubborn belly fat, low energy, poor sleep, and mood swings.',
    infoContent: {
      text: 'Managing cortisol can help you:',
      bullets: [
        'Lose weight more easily',
        'Sleep better',
        'Have more steady energy',
        'Feel calmer and less stressed',
      ],
    },
  },

  // Step 5: Weight loss motivation
  {
    id: 'weight-loss-motivation',
    type: 'multi-select',
    title: 'Why do you want to lose weight?',
    subtitle: 'You can have multiple goals',
    options: [
      { id: 'looks', label: 'Improve how I look', image: '/images/1.png' },
      { id: 'health', label: 'Become healthier', image: '/images/2.png' },
      { id: 'calm', label: 'Feel calmer', image: '/images/3.png' },
      { id: 'energy', label: 'Improved energy & mood', image: '/images/4.png' },
    ],
  },

  // Step 6: Current body type
  {
    id: 'current-body-type',
    type: 'single-select',
    title: 'What is your current body type?',
    options: [
      { id: 'regular', label: 'Regular', image: '/images/regular.png' },
      { id: 'flabby', label: 'Flabby', image: '/images/flabby.png' },
      { id: 'muffin-top', label: 'Muffin top', image: '/images/muffin-top.png' },
      { id: 'overweight', label: 'Overweight', image: '/images/overweight.png' },
      { id: 'obese', label: 'Obese', image: '/images/obese.png' },
    ],
  },

  // Step 7: Time since ideal weight
  {
    id: 'time-since-ideal',
    type: 'single-select',
    title: 'How long has it been since you had your ideal weight?',
    options: [
      { id: 'less-1', label: 'Less than 1 year', emoji: '😅' },
      { id: '1-3', label: '1-3 years', emoji: '😳' },
      { id: 'more-3', label: 'More than 3 years', emoji: '😬' },
      { id: 'never', label: 'Never', emoji: '🙍‍♀️' },
      { id: 'have-it', label: 'I have it now', emoji: '💃' },
    ],
  },

  // Step 8: Target body type
  {
    id: 'target-body-type',
    type: 'single-select',
    title: 'What is your target body type?',
    options: [
      { id: 'curvy', label: 'Curvy', image: '/images/meta-1.png' },
      { id: 'regular', label: 'Regular', image: '/images/meta-2.png' },
      { id: 'flat', label: 'Flat', image: '/images/meta-3.png' },
      { id: 'fit', label: 'Fit', image: '/images/meta-4.png' },
      { id: 'athletic', label: 'Athletic', image: '/images/meta-5.png' },
    ],
  },

  // Step 9: Target zones
  {
    id: 'target-zones',
    type: 'multi-select',
    title: 'Select your target zones',
    options: [
      { id: 'arms', label: 'Arms', image: '/images/arms.png' },
      { id: 'stomach', label: 'Stomach', image: '/images/stomach.png' },
      { id: 'back', label: 'Back', image: '/images/back.png' },
      { id: 'glutes', label: 'Glutes', image: '/images/glutes.png' },
      { id: 'legs', label: 'Legs', image: '/images/legs.png' },
      { id: 'hips', label: 'Hips', image: '/images/hips.png' },
      { id: 'whole-body', label: 'Whole body', image: '/images/full-body.png' },
    ],
  },

  // Step 10: Menopause status
  {
    id: 'menopause-status',
    type: 'single-select',
    title: 'Are you currently going through menopause?',
    options: [
      { id: 'perimenopause', label: "I'm in perimenopause", emoji: '🙍🏽‍♀️' },
      { id: 'menopause', label: "I'm in menopause", emoji: '🙍🏼‍♀️' },
      { id: 'postmenopause', label: "I'm in postmenopause", emoji: '👩🏽' },
      { id: 'none', label: 'None of the above', emoji: '❌' },
    ],
  },

  // Step 11: Menopause symptoms
  {
    id: 'menopause-symptoms',
    type: 'multi-select',
    title: 'Have you noticed any of these menopause symptoms?',
    options: [
      { id: 'hot-flashes', label: 'Hot flashes', emoji: '⚡' },
      { id: 'fatigue', label: 'Fatigue', emoji: '😞' },
      { id: 'sleep', label: 'Sleep problems', emoji: '😴' },
      { id: 'hair-skin', label: 'Thinning hair and dry skin', emoji: '👩‍🦲' },
      { id: 'mood', label: 'Mood changes', emoji: '🥺' },
      { id: 'night-sweats', label: 'Night sweats', emoji: '💧' },
      { id: 'vaginal-dryness', label: 'Vaginal dryness', emoji: '🙆‍♀️' },
      { id: 'none', label: 'None of the above', emoji: '❌' },
    ],
  },

  // Step 12: Traditional diets info
  {
    id: 'diets-info',
    type: 'info',
    title: "Traditional diets don't work when cortisol is out of balance",
    image: '/images/nutrition-menopause.avif',
    infoContent: {
      text: 'This plan helps women over 40 lose weight, boost energy, and curb cravings by calming stress hormones with hormone-friendly meals, simple exercise, and sustainable routines.',
      bullets: [],
    },
  },

  // Step 13: Physical activity
  {
    id: 'physical-activity',
    type: 'single-select',
    title: 'How physically active are you?',
    options: [
      { id: 'not-at-all', label: 'Not at all', emoji: '❌' },
      { id: 'walking', label: 'Just walking', emoji: '🚶‍♀️' },
      { id: '1-week', label: '1 exercise session / week', emoji: '👍' },
      { id: '3-4-week', label: '3-4 exercise sessions / week', emoji: '💪' },
      { id: '5-week', label: '5 exercise sessions / week', emoji: '🚀' },
    ],
  },

  // Step 14: Walking
  {
    id: 'walking-amount',
    type: 'single-select',
    title: 'How much walking do you get in on a typical day?',
    options: [
      { id: 'less-20', label: 'Less than 20 mins', emoji: '🚶‍♀️' },
      { id: '20-60', label: '20-60 mins', emoji: '🚶‍♀️🚶‍♀️' },
      { id: 'more-60', label: 'More than 60 mins', emoji: '🚶‍♀️🚶‍♀️🚶‍♀️' },
    ],
  },

  // Step 15: Water intake
  {
    id: 'water-intake',
    type: 'single-select',
    title: 'How much water do you drink daily?',
    options: [
      { id: 'coffee-only', label: 'Only coffee, tea or soda', emoji: '☕' },
      { id: 'less-2', label: 'Less than 2 glasses', emoji: '🥤' },
      { id: '2-6', label: '2-6 glasses', emoji: '💧' },
      { id: '7-10', label: '7-10 glasses', emoji: '💦' },
      { id: 'more-10', label: 'More than 10 glasses', emoji: '🏊‍♀️' },
    ],
  },

  // Step 16: Sleep
  {
    id: 'sleep-hours',
    type: 'single-select',
    title: 'How many hours of sleep do you get?',
    options: [
      { id: 'less-5', label: 'Fewer than 5 hours', emoji: '😵' },
      { id: '5-6', label: 'Between 5 and 6 hours', emoji: '🥱' },
      { id: '7-8', label: 'Between 7 and 8 hours', emoji: '😴' },
      { id: 'more-8', label: 'Over 8 hours', emoji: '😊' },
    ],
  },

  // Step 17: Height
  {
    id: 'height',
    type: 'input',
    title: 'What is your height?',
    subtitle: 'This information helps us in metabolic calculations and to personalize your plan to achieve your optimal weight!',
    inputConfig: {
      hasUnitToggle: true,
      units: { imperial: 'Imperial', metric: 'Metric' },
      fields: [
        { name: 'height_ft', label: 'Height', placeholder: 'Height', suffix: 'ft', type: 'number' },
        { name: 'height_in', label: 'Height', placeholder: 'Height', suffix: 'in', type: 'number' },
      ],
    },
  },

  // Step 18: Weight
  {
    id: 'weight',
    type: 'input',
    title: 'What is your weight?',
    subtitle: 'This information helps us in metabolic calculations and to personalize your plan to achieve your optimal weight!',
    inputConfig: {
      hasUnitToggle: true,
      units: { imperial: 'Imperial', metric: 'Metric' },
      fields: [
        { name: 'weight', label: 'Weight', placeholder: 'Weight', suffix: 'kg', type: 'number' },
      ],
    },
  },

  // Step 19: Desired weight
  {
    id: 'desired-weight',
    type: 'input',
    title: 'What is your desired weight?',
    subtitle: 'Our program has helped thousands of women just like you reach their desired body weight.',
    inputConfig: {
      hasUnitToggle: true,
      units: { imperial: 'Imperial', metric: 'Metric' },
      fields: [
        { name: 'desired_weight', label: 'Weight', placeholder: 'Weight', suffix: 'kg', type: 'number' },
      ],
    },
  },

  // Step 20: Age
  {
    id: 'age',
    type: 'input',
    title: 'How old are you?',
    subtitle: 'This information helps us in metabolic calculations and to personalize your plan to achieve your optimal weight!',
    inputConfig: {
      hasUnitToggle: false,
      fields: [
        { name: 'age', label: 'Age', placeholder: 'Age', suffix: 'years', type: 'number' },
      ],
    },
  },

  // Step 21: Results chart
  {
    id: 'results-chart',
    type: 'results-chart',
    title: 'Your potential improvement in 12 weeks',
    subtitle: '',
  },

  // Step 22: Forbes social proof
  {
    id: 'social-proof-forbes',
    type: 'social-proof',
    title: "The best women's lifestyle app in 2025",
    image: '/images/mockup.png',
  },

  // Step 23: Email capture
  {
    id: 'email-capture',
    type: 'email-capture',
    title: 'Enter your email to receive your',
    subtitle: 'Cortisol Cleanse program',
  },

  // Step 24: 7-day results
  {
    id: 'results-7-day',
    type: 'results-progress',
    title: 'Estimated results in first 7 days',
    subtitle: 'If you are active with our plan, we estimate that you can lose.',
  },

  // Step 25: Media social proof
  {
    id: 'social-proof-media',
    type: 'social-proof',
    title: 'Our app and coaches featured in',
    image: '/images/expert.avif',
    infoContent: {
      text: 'Our program authors are certified fitness and lifestyle coaches with extensive experience in weight loss.',
      bullets: [],
    },
  },

  // Step 26: Pricing
  {
    id: 'pricing',
    type: 'pricing',
    title: 'Choose Your Plan',
    skipProgress: true,
  },
]

export function getStepIndex(stepId: string): number {
  return QUIZ_STEPS.findIndex(s => s.id === stepId)
}

export function getTotalQuizSteps(): number {
  return QUIZ_STEPS.filter(s => !s.skipProgress).length
}

export function getProgressStepNumber(currentIndex: number): number {
  return QUIZ_STEPS.slice(0, currentIndex + 1).filter(s => !s.skipProgress).length
}
