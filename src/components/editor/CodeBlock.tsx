'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Edit2, Save, X, Copy, Check } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface CodeBlockProps {
  id: string
  content: string
  isEditing?: boolean
  onUpdate?: (content: string) => void
  onDelete?: () => void
}

export function CodeBlock({ id, content, isEditing = false, onUpdate, onDelete }: CodeBlockProps) {
  const [editing, setEditing] = useState(isEditing)
  const [code, setCode] = useState(content)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(code)
    }
    setEditing(false)
  }

  const handleCancel = () => {
    setCode(content)
    setEditing(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    toast({
      title: 'Copied to clipboard',
      description: 'Code has been copied to your clipboard',
    })
    setTimeout(() => setCopied(false), 2000)
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="min-h-[200px] font-mono text-sm"
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
    <div className="group relative">
      <pre className="p-4 bg-black/5 dark:bg-white/5 rounded-lg overflow-x-auto">
        <code className="text-sm font-mono">{content}</code>
      </pre>
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="ghost" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
        {onUpdate && (
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
