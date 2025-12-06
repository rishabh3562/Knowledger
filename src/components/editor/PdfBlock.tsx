'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/FileUpload'
import { FileText, Download, Trash2, Edit2 } from 'lucide-react'

interface PdfBlockProps {
  id: string
  fileUrl: string
  onUpdate?: (updates: { file_url: string }) => void
  onDelete?: () => void
}

export function PdfBlock({ id, fileUrl, onUpdate, onDelete }: PdfBlockProps) {
  const [editing, setEditing] = useState(!fileUrl)
  const fileName = fileUrl ? fileUrl.split('/').pop() || 'document.pdf' : ''

  const handleUploadComplete = (url: string) => {
    if (onUpdate) {
      onUpdate({ file_url: url })
      setEditing(false)
    }
  }

  const handleDownload = () => {
    window.open(fileUrl, '_blank')
  }

  if (editing || !fileUrl) {
    return (
      <div className="p-4 border rounded-lg bg-muted/30">
        <FileUpload
          accept="application/pdf"
          onUploadComplete={handleUploadComplete}
          maxSize={50}
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
    <div className="group relative p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded flex items-center justify-center">
          <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{fileName}</p>
          <p className="text-xs text-muted-foreground">PDF Document</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            View
          </Button>
          {onUpdate && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditing(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
