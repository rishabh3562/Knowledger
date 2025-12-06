'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Edit2, Save, X } from 'lucide-react'

interface TextBlockProps {
  id: string
  content: string
  isEditing?: boolean
  onUpdate?: (content: string) => void
  onDelete?: () => void
}

export function TextBlock({ id, content, isEditing = false, onUpdate, onDelete }: TextBlockProps) {
  const [editing, setEditing] = useState(isEditing)
  const [text, setText] = useState(content)

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(text)
    }
    setEditing(false)
  }

  const handleCancel = () => {
    setText(content)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text..."
          className="min-h-[100px]"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative p-4 bg-muted/30 rounded-lg">
      <div className="prose prose-sm max-w-none whitespace-pre-wrap">
        {content}
      </div>
      {onUpdate && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setEditing(true)}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
