"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AvatarUploadProps {
  currentAvatar?: string
  onChange: (file: File | null) => void
}

export function AvatarUpload({ currentAvatar, onChange }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onChange(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0] || null
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onChange(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative h-32 w-32 rounded-full overflow-hidden border-2 transition-all duration-300 ${
          isDragging
            ? "border-primary border-dashed scale-105"
            : preview
              ? "border-primary"
              : "border-muted-foreground/30"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <>
            <img src={preview || "/placeholder.svg"} alt="Avatar preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-background transition-colors"
            >
              <X className="h-4 w-4 text-destructive" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/20">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="avatar-upload"
      />

      <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => fileInputRef.current?.click()}>
        {preview ? "Change Avatar" : "Upload Avatar"}
      </Button>

      <p className="text-xs text-muted-foreground mt-2 text-center">
        Drag & drop or click to upload
        <br />
        JPG, PNG or GIF, max 2MB
      </p>
    </div>
  )
}
