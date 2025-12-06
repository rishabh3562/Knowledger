'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Upload, Loader2 } from 'lucide-react'

interface FileUploadProps {
  accept?: string
  onUploadComplete: (url: string) => void
  maxSize?: number // in MB
}

export function FileUpload({ accept, onUploadComplete, maxSize = 10 }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      toast({
        title: 'File too large',
        description: `File size should be less than ${maxSize}MB`,
        variant: 'destructive',
      })
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onUploadComplete(data.url)
        toast({
          title: 'Success',
          description: 'File uploaded successfully',
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Upload failed',
          description: error.error || 'Failed to upload file',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={uploading}
        className="cursor-pointer"
      />
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Uploading...
        </div>
      )}
    </div>
  )
}
