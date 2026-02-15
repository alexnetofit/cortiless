import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Total quiz sessions
    const { count: totalSessions } = await supabase
      .from('quiz_sessions')
      .select('*', { count: 'exact', head: true })

    // Sessions with email (leads)
    const { count: emailLeads } = await supabase
      .from('quiz_sessions')
      .select('*', { count: 'exact', head: true })
      .not('email', 'is', null)

    // Converted sessions
    const { count: conversions } = await supabase
      .from('quiz_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('converted', true)

    // Total users
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    // Step distribution (funnel)
    const { data: stepData } = await supabase
      .from('quiz_sessions')
      .select('current_step')

    const stepDistribution: Record<number, number> = {}
    stepData?.forEach(session => {
      const step = session.current_step || 1
      stepDistribution[step] = (stepDistribution[step] || 0) + 1
    })

    // Recent leads
    const { data: recentLeads } = await supabase
      .from('quiz_sessions')
      .select('id, email, current_step, converted, created_at')
      .not('email', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20)

    // Users by plan
    const { data: planData } = await supabase
      .from('user_profiles')
      .select('plan_type')

    const planDistribution: Record<string, number> = {}
    planData?.forEach(profile => {
      const plan = profile.plan_type || 'unknown'
      planDistribution[plan] = (planDistribution[plan] || 0) + 1
    })

    // Sessions by day (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: dailyData } = await supabase
      .from('quiz_sessions')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())

    const dailySessions: Record<string, number> = {}
    dailyData?.forEach(session => {
      const date = session.created_at.split('T')[0]
      dailySessions[date] = (dailySessions[date] || 0) + 1
    })

    return NextResponse.json({
      totalSessions: totalSessions || 0,
      emailLeads: emailLeads || 0,
      conversions: conversions || 0,
      totalUsers: totalUsers || 0,
      conversionRate: totalSessions ? ((conversions || 0) / totalSessions * 100).toFixed(1) : '0',
      emailCaptureRate: totalSessions ? ((emailLeads || 0) / totalSessions * 100).toFixed(1) : '0',
      stepDistribution,
      planDistribution,
      recentLeads: recentLeads || [],
      dailySessions,
    })
  } catch (error) {
    console.error('Metrics error:', error)
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}
