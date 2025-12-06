'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { KnowledgeGraph } from '@/components/KnowledgeGraph'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, BookOpen } from 'lucide-react'

interface Chapter {
  id: string
  title: string
  tags: string[]
}

interface ChapterLink {
  id: string
  from_chapter: string
  to_chapter: string
}

export default function GraphPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [links, setLinks] = useState<ChapterLink[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [chaptersRes, linksRes] = await Promise.all([
        fetch('/api/chapters'),
        fetch('/api/links'),
      ])

      if (chaptersRes.ok && linksRes.ok) {
        const chaptersData = await chaptersRes.json()
        const linksData = await linksRes.json()
        setChapters(chaptersData)
        setLinks(linksData)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load graph data',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load graph data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLinkCreate = async (fromId: string, toId: string) => {
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_chapter: fromId,
          to_chapter: toId,
        }),
      })

      if (response.ok) {
        const newLink = await response.json()
        setLinks([...links, newLink])
        toast({
          title: 'Success',
          description: 'Link created successfully',
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to create link',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create link',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Knowledge Graph</h1>
            </div>
            <Link href="/chapters">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Chapters
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {chapters.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No chapters yet</h3>
            <p className="text-muted-foreground mb-6">
              Create some chapters to see your knowledge graph
            </p>
            <Link href="/chapters/create">
              <Button>Create Your First Chapter</Button>
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground mb-4">
              Click and drag to connect chapters. Click on a node to view the chapter.
            </p>
            <KnowledgeGraph
              chapters={chapters}
              links={links}
              onLinkCreate={handleLinkCreate}
            />
          </div>
        )}
      </div>
    </div>
  )
}
