import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/auth'

type BlockWithChapterId = {
  chapter_id: string
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, content, file_url, position } = body

    // Verify user owns the block via chapter
    const { data: existingBlock, error: blockError } = await supabase
      .from('blocks')
      .select('chapter_id')
      .eq('id', params.id)
      .single<BlockWithChapterId>()

    if (blockError || !existingBlock) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 })
    }

    const { data: chapter } = await supabase
      .from('chapters')
      .select('id')
      .eq('id', existingBlock.chapter_id)
      .eq('user_id', user.id)
      .single()

    if (!chapter) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updateData: any = {}
    if (type) updateData.type = type
    if (content !== undefined) updateData.content = content
    if (file_url !== undefined) updateData.file_url = file_url
    if (position !== undefined) updateData.position = position

    // @ts-ignore - Supabase SSR type inference issue
    const { data: block, error } = await supabase.from('blocks').update(updateData).eq('id', params.id).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(block)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user owns the block via chapter
    const { data: existingBlock, error: blockError } = await supabase
      .from('blocks')
      .select('chapter_id')
      .eq('id', params.id)
      .single<BlockWithChapterId>()

    if (blockError || !existingBlock) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 })
    }

    const { data: chapter } = await supabase
      .from('chapters')
      .select('id')
      .eq('id', existingBlock.chapter_id)
      .eq('user_id', user.id)
      .single()

    if (!chapter) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await supabase
      .from('blocks')
      .delete()
      .eq('id', params.id)

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
