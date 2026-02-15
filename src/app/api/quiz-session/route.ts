import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert({
        utm_source: body.utm_source,
        utm_medium: body.utm_medium,
        utm_campaign: body.utm_campaign,
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ id: data.id })
  } catch (error) {
    console.error('Quiz session error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = createAdminClient()

    const updateData: Record<string, unknown> = {}
    if (body.answers) updateData.answers = body.answers
    if (body.current_step) updateData.current_step = body.current_step
    if (body.email) updateData.email = body.email
    if (body.completed_at) updateData.completed_at = body.completed_at

    const { error } = await supabase
      .from('quiz_sessions')
      .update(updateData)
      .eq('id', body.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Quiz session update error:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}
