import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS, PlanKey } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { plan, email, sessionId } = await req.json()

    if (!plan || !PLANS[plan as PlanKey]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const planDetails = PLANS[plan as PlanKey]
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Cortiless - ${planDetails.name}`,
              description: `${planDetails.duration}-day access to the Cortiless Cortisol Cleanse program`,
            },
            unit_amount: planDetails.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        plan,
        quiz_session_id: sessionId || '',
        duration_days: String(planDetails.duration),
      },
      success_url: `${baseUrl}/auth/register?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${baseUrl}/quiz?step=pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
