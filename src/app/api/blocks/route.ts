import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { chapter_id, type, content, file_url, position } = body

    if (!chapter_id || !type || position === undefined) {
      return NextResponse.json(
        { error: 'chapter_id, type, and position are required' },
        { status: 400 }
      )
    }

    // Verify user owns the chapter
    const { data: chapter } = await supabase
      .from('chapters')
      .select('id')
      .eq('id', chapter_id)
      .eq('user_id', user.id)
      .single()

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found or unauthorized' },
        { status: 404 }
      )
    }

    const { data: block, error } = await supabase
      .from('blocks')
      .insert({
        chapter_id,
        type,
        content: content || null,
        file_url: file_url || null,
        position,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(block, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
