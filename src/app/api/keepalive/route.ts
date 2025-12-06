import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  const startTime = Date.now()

  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Create Supabase client with service role key for better access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Perform a simple query to keep the database active
    const { data, error } = await supabase
      .from('keepalive_logs')
      .select('id')
      .limit(1)

    const responseTime = Date.now() - startTime

    // Log this keepalive ping
    const { error: logError } = await supabase
      .from('keepalive_logs')
      .insert({
        pinged_at: new Date().toISOString(),
        status: error ? 'error' : 'success',
        response_time_ms: responseTime,
        error_message: error?.message || null,
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('user-agent'),
        }
      })

    if (logError) {
      console.error('Failed to log keepalive:', logError)
    }

    return NextResponse.json({
      success: true,
      message: 'Keepalive ping successful',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    const responseTime = Date.now() - startTime

    console.error('Keepalive error:', error)

    return NextResponse.json({
      success: false,
      error: error.message,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
