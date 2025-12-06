'use client'

import { TextBlock } from './TextBlock'
import { CodeBlock } from './CodeBlock'
import { ImageBlock } from './ImageBlock'
import { PdfBlock } from './PdfBlock'
import { LinkBlock } from './LinkBlock'

interface Block {
  id: string
  type: 'text' | 'code' | 'image' | 'pdf' | 'link'
  content: string | null
  file_url: string | null
  position: number
}

interface BlockRendererProps {
  block: Block
  isEditing?: boolean
  onUpdate?: (blockId: string, updates: Partial<Block>) => void
  onDelete?: (blockId: string) => void
}

export function BlockRenderer({ block, isEditing = false, onUpdate, onDelete }: BlockRendererProps) {
  const handleUpdate = (content: string) => {
    if (onUpdate) {
      onUpdate(block.id, { content })
    }
  }

  const handleFileUpdate = (updates: { file_url: string }) => {
    if (onUpdate) {
      onUpdate(block.id, updates)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(block.id)
    }
  }

  switch (block.type) {
    case 'text':
      return (
        <TextBlock
          id={block.id}
          content={block.content || ''}
          isEditing={isEditing}
          onUpdate={onUpdate ? handleUpdate : undefined}
          onDelete={onDelete ? handleDelete : undefined}
        />
      )
    case 'code':
      return (
        <CodeBlock
          id={block.id}
          content={block.content || ''}
          isEditing={isEditing}
          onUpdate={onUpdate ? handleUpdate : undefined}
          onDelete={onDelete ? handleDelete : undefined}
        />
      )
    case 'image':
      return (
        <ImageBlock
          id={block.id}
          fileUrl={block.file_url || ''}
          onUpdate={onUpdate ? handleFileUpdate : undefined}
          onDelete={onDelete ? handleDelete : undefined}
        />
      )
    case 'pdf':
      return (
        <PdfBlock
          id={block.id}
          fileUrl={block.file_url || ''}
          onUpdate={onUpdate ? handleFileUpdate : undefined}
          onDelete={onDelete ? handleDelete : undefined}
        />
      )
    case 'link':
      return (
        <LinkBlock
          id={block.id}
          content={block.content || ''}
          isEditing={isEditing}
          onUpdate={onUpdate ? handleUpdate : undefined}
          onDelete={onDelete ? handleDelete : undefined}
        />
      )
    default:
      return null
  }
}
