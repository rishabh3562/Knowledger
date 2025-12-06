'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import {
  ArrowLeft,
  Plus,
  Type,
  Code,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  Trash2,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Block {
  id: string
  type: 'text' | 'code' | 'image' | 'pdf' | 'link'
  content: string | null
  file_url: string | null
  position: number
}

interface Chapter {
  id: string
  title: string
  summary: string
  tags: string[]
  cover_image: string | null
  created_at: string
  blocks: Block[]
}

function SortableBlock({
  block,
  onUpdate,
  onDelete,
}: {
  block: Block
  onUpdate: (blockId: string, updates: Partial<Block>) => void
  onDelete: (blockId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: block.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="mb-4 p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
        <BlockRenderer block={block} onUpdate={onUpdate} onDelete={onDelete} />
      </div>
    </div>
  )
}

export default function ChapterPage() {
  const params = useParams()
  const id = params.id as string
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [showBlockMenu, setShowBlockMenu] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchChapter()
  }, [id])

  const fetchChapter = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/chapters/${id}`)
      if (response.ok) {
        const data = await response.json()
        setChapter(data)
        setBlocks(data.blocks || [])
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load chapter',
          variant: 'destructive',
        })
        router.push('/chapters')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load chapter',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const addBlock = async (type: Block['type']) => {
    try {
      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapter_id: id,
          type,
          content: type === 'text' || type === 'code' || type === 'link' ? '' : null,
          file_url: null,
          position: blocks.length,
        }),
      })

      if (response.ok) {
        const newBlock = await response.json()
        setBlocks([...blocks, newBlock])
        setShowBlockMenu(false)
        toast({
          title: 'Success',
          description: 'Block added successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add block',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add block',
        variant: 'destructive',
      })
    }
  }

  const updateBlock = async (blockId: string, updates: Partial<Block>) => {
    try {
      const response = await fetch(`/api/blocks/${blockId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedBlock = await response.json()
        setBlocks(blocks.map((b) => (b.id === blockId ? updatedBlock : b)))
        toast({
          title: 'Success',
          description: 'Block updated successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update block',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update block',
        variant: 'destructive',
      })
    }
  }

  const deleteBlock = async (blockId: string) => {
    try {
      const response = await fetch(`/api/blocks/${blockId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setBlocks(blocks.filter((b) => b.id !== blockId))
        toast({
          title: 'Success',
          description: 'Block deleted successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete block',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete block',
        variant: 'destructive',
      })
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)

      const newBlocks = arrayMove(blocks, oldIndex, newIndex)
      setBlocks(newBlocks)

      // Update positions in database
      try {
        await Promise.all(
          newBlocks.map((block, index) =>
            fetch(`/api/blocks/${block.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ position: index }),
            })
          )
        )
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update block positions',
          variant: 'destructive',
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!chapter) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/chapters">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chapters
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{chapter.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{chapter.summary}</p>
            <div className="flex flex-wrap gap-2">
              {chapter.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                {blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    onUpdate={updateBlock}
                    onDelete={deleteBlock}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          {!showBlockMenu ? (
            <Button onClick={() => setShowBlockMenu(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Block
            </Button>
          ) : (
            <Card className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <Button
                  variant="outline"
                  className="flex flex-col h-20"
                  onClick={() => addBlock('text')}
                >
                  <Type className="w-6 h-6 mb-2" />
                  Text
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col h-20"
                  onClick={() => addBlock('code')}
                >
                  <Code className="w-6 h-6 mb-2" />
                  Code
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col h-20"
                  onClick={() => addBlock('image')}
                >
                  <ImageIcon className="w-6 h-6 mb-2" />
                  Image
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col h-20"
                  onClick={() => addBlock('pdf')}
                >
                  <FileText className="w-6 h-6 mb-2" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col h-20"
                  onClick={() => addBlock('link')}
                >
                  <LinkIcon className="w-6 h-6 mb-2" />
                  Link
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={() => setShowBlockMenu(false)}
              >
                Cancel
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
