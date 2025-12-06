'use client'

import { useEffect, useState, useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface Chapter {
  id: string
  title: string
  tags: string[]
}

interface Link {
  id: string
  from_chapter: string
  to_chapter: string
}

interface KnowledgeGraphProps {
  chapters: Chapter[]
  links: Link[]
  onLinkCreate?: (fromId: string, toId: string) => void
  onLinkDelete?: (linkId: string) => void
}

export function KnowledgeGraph({ chapters, links, onLinkCreate, onLinkDelete }: KnowledgeGraphProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    // Create nodes from chapters
    const newNodes: Node[] = chapters.map((chapter, index) => ({
      id: chapter.id,
      type: 'default',
      data: {
        label: (
          <div className="px-3 py-2">
            <div className="font-semibold text-sm">{chapter.title}</div>
            {chapter.tags.length > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {chapter.tags.slice(0, 2).join(', ')}
              </div>
            )}
          </div>
        )
      },
      position: {
        x: Math.cos((index / chapters.length) * 2 * Math.PI) * 300 + 400,
        y: Math.sin((index / chapters.length) * 2 * Math.PI) * 300 + 300,
      },
    }))

    // Create edges from links
    const newEdges: Edge[] = links.map((link) => ({
      id: link.id,
      source: link.from_chapter,
      target: link.to_chapter,
      animated: true,
    }))

    setNodes(newNodes)
    setEdges(newEdges)
  }, [chapters, links])

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target && onLinkCreate) {
        onLinkCreate(connection.source, connection.target)
      }
    },
    [onLinkCreate]
  )

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      router.push(`/chapters/${node.id}`)
    },
    [router]
  )

  return (
    <div className="w-full h-[600px] border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
