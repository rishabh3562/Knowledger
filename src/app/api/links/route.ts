import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all chapters for the user
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id')
      .eq('user_id', user.id)

    if (!chapters || chapters.length === 0) {
      return NextResponse.json([])
    }

    const chapterIds = chapters.map(c => c.id)

    // Get all links where from_chapter is owned by user
    const { data: links, error } = await supabase
      .from('links')
      .select('*')
      .in('from_chapter', chapterIds)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(links)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { from_chapter, to_chapter } = body

    if (!from_chapter || !to_chapter) {
      return NextResponse.json(
        { error: 'from_chapter and to_chapter are required' },
        { status: 400 }
      )
    }

    // Verify user owns both chapters
    const { data: fromChapter } = await supabase
      .from('chapters')
      .select('id')
      .eq('id', from_chapter)
      .eq('user_id', user.id)
      .single()

    const { data: toChapter } = await supabase
      .from('chapters')
      .select('id')
      .eq('id', to_chapter)
      .eq('user_id', user.id)
      .single()

    if (!fromChapter || !toChapter) {
      return NextResponse.json(
        { error: 'One or both chapters not found or unauthorized' },
        { status: 404 }
      )
    }

    const { data: link, error } = await supabase
      .from('links')
      .insert({
        from_chapter,
        to_chapter,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const linkId = searchParams.get('id')

    if (!linkId) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 })
    }

    // Verify user owns the from_chapter
    const { data: link } = await supabase
      .from('links')
      .select('from_chapter')
      .eq('id', linkId)
      .single()

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    const { data: chapter } = await supabase
      .from('chapters')
      .select('id')
      .eq('id', link.from_chapter)
      .eq('user_id', user.id)
      .single()

    if (!chapter) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
