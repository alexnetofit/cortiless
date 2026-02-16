export const PLANS = {
  '1-month': {
    name: '1-WEEK PLAN',
    price: 714,
    originalPrice: '$18.30',
    priceDisplay: '$7.14',
    originalPerDay: '$2.61',
    perDay: '$1.02',
    duration: 7,
    popular: false,
    gift: false,
  },
  '3-month': {
    name: '4-WEEK PLAN',
    price: 1565,
    originalPrice: '$40.12',
    priceDisplay: '$15.65',
    originalPerDay: '$1.43',
    perDay: '$0.56',
    duration: 28,
    popular: true,
    gift: false,
  },
  '12-month': {
    name: '12-WEEK PLAN',
    price: 2677,
    originalPrice: '$68.65',
    priceDisplay: '$26.77',
    originalPerDay: '$0.82',
    perDay: '$0.31',
    duration: 84,
    popular: false,
    gift: true,
  },
} as const

export type PlanKey = keyof typeof PLANS
