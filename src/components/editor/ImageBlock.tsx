'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/FileUpload'
import { Edit2, Trash2 } from 'lucide-react'

interface ImageBlockProps {
  id: string
  fileUrl: string
  onUpdate?: (updates: { file_url: string }) => void
  onDelete?: () => void
}

export function ImageBlock({ id, fileUrl, onUpdate, onDelete }: ImageBlockProps) {
  const [editing, setEditing] = useState(!fileUrl)

  const handleUploadComplete = (url: string) => {
    if (onUpdate) {
      onUpdate({ file_url: url })
      setEditing(false)
    }
  }

  if (editing || !fileUrl) {
    return (
      <div className="p-4 border rounded-lg bg-muted/30">
        <FileUpload
          accept="image/*"
          onUploadComplete={handleUploadComplete}
          maxSize={10}
        />
        {fileUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setEditing(false)}
          >
            Cancel
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="group relative">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
        <Image
          src={fileUrl}
          alt="Block image"
          fill
          className="object-contain"
        />
      </div>
      {(onUpdate || onDelete) && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onUpdate && (
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="ghost" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
