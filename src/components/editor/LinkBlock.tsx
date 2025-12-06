'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Edit2, Save, X, ExternalLink } from 'lucide-react'

interface LinkBlockProps {
  id: string
  content: string
  isEditing?: boolean
  onUpdate?: (content: string) => void
  onDelete?: () => void
}

export function LinkBlock({ id, content, isEditing = false, onUpdate, onDelete }: LinkBlockProps) {
  const [editing, setEditing] = useState(isEditing)
  const [url, setUrl] = useState(content)

  const handleSave = () => {
    if (onUpdate && url) {
      onUpdate(url)
    }
    setEditing(false)
  }

  const handleCancel = () => {
    setUrl(content)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          type="url"
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
    <div className="group relative p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <a
        href={content}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:underline"
      >
        <ExternalLink className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">{content}</span>
      </a>
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
