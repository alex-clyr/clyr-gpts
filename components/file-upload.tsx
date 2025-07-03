"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Paperclip } from "lucide-react"

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
}

export function FileUpload({ onFilesSelected }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    onFilesSelected(files)
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="glass border-white/20"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
    </>
  )
}
