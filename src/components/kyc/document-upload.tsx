"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, FileText, Check, Loader2 } from "lucide-react"

interface DocumentUploadProps {
  onSubmit: (data: FormData) => void
  isSubmitting: boolean
}

export function DocumentUpload({ onSubmit, isSubmitting }: DocumentUploadProps) {
  const [documentType, setDocumentType] = useState("")
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)

  const needsBackImage = documentType === "drivers_license" || documentType === "id_card"

  const handleFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          frontImage: "Invalid file type. Please upload a JPG, PNG, or PDF file.",
        }))
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          frontImage: "File size exceeds 5MB. Please upload a smaller file.",
        }))
        return
      }

      setFrontImage(file)
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.frontImage
        return newErrors
      })

      // Create preview for image files
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFrontPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setFrontPreview(null)
      }
    }
  }

  const handleBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          backImage: "Invalid file type. Please upload a JPG, PNG, or PDF file.",
        }))
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          backImage: "File size exceeds 5MB. Please upload a smaller file.",
        }))
        return
      }

      setBackImage(file)
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.backImage
        return newErrors
      })

      // Create preview for image files
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setBackPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setBackPreview(null)
      }
    }
  }

  const removeFrontImage = () => {
    setFrontImage(null)
    setFrontPreview(null)
  }

  const removeBackImage = () => {
    setBackImage(null)
    setBackPreview(null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!documentType) {
      newErrors.documentType = "Please select a document type"
    }

    if (!frontImage) {
      newErrors.frontImage = "Please upload the front of your document"
    }

    if (needsBackImage && !backImage) {
      newErrors.backImage = "Please upload the back of your document"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const formData = new FormData()
    formData.append("documentType", documentType)
    if (frontImage) formData.append("frontImage", frontImage)
    if (backImage) formData.append("backImage", backImage)
    formData.append("additionalInfo", additionalInfo)

    onSubmit(formData)
  }

  return (
    <Card className="border-muted/30 bg-black/40 backdrop-blur-sm shadow-xl animate-fadeIn">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Upload className="h-5 w-5 text-purple-400" />
          Upload Your Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="document-type">
              Document Type <span className="text-red-500">*</span>
            </Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger id="document-type" className={errors.documentType ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="drivers_license">Driver's License</SelectItem>
                <SelectItem value="id_card">National ID Card</SelectItem>
                <SelectItem value="residence_permit">Residence Permit</SelectItem>
              </SelectContent>
            </Select>
            {errors.documentType && <p className="text-red-500 text-xs mt-1">{errors.documentType}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="front-image">
              Front of Document <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed border-muted/50 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
              {frontPreview ? (
                <div className="relative">
                  <img
                    src={frontPreview || "/placeholder.svg"}
                    alt="Document front preview"
                    className="max-h-48 mx-auto rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={removeFrontImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : frontImage && frontImage.type === "application/pdf" ? (
                <div className="flex items-center justify-between bg-muted/20 p-3 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-purple-400 mr-2" />
                    <div>
                      <p className="font-medium">{frontImage.name}</p>
                      <p className="text-xs text-muted-foreground">{(frontImage.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={removeFrontImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">Upload front of your document</p>
                  <p className="text-xs text-muted-foreground mb-4">JPG, PNG or PDF (max 5MB)</p>
                  <Input
                    id="front-image"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFrontImageChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="front-image"
                    className="bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-colors cursor-pointer py-2 px-4 rounded-md text-sm"
                  >
                    Select File
                  </Label>
                </div>
              )}
            </div>
            {errors.frontImage && <p className="text-red-500 text-xs mt-1">{errors.frontImage}</p>}
          </div>

          {needsBackImage && (
            <div className="space-y-2">
              <Label htmlFor="back-image">
                Back of Document <span className="text-red-500">*</span>
              </Label>
              <div className="border-2 border-dashed border-muted/50 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                {backPreview ? (
                  <div className="relative">
                    <img
                      src={backPreview || "/placeholder.svg"}
                      alt="Document back preview"
                      className="max-h-48 mx-auto rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={removeBackImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : backImage && backImage.type === "application/pdf" ? (
                  <div className="flex items-center justify-between bg-muted/20 p-3 rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-purple-400 mr-2" />
                      <div>
                        <p className="font-medium">{backImage.name}</p>
                        <p className="text-xs text-muted-foreground">{(backImage.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={removeBackImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium mb-1">Upload back of your document</p>
                    <p className="text-xs text-muted-foreground mb-4">JPG, PNG or PDF (max 5MB)</p>
                    <Input
                      id="back-image"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleBackImageChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="back-image"
                      className="bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-colors cursor-pointer py-2 px-4 rounded-md text-sm"
                    >
                      Select File
                    </Label>
                  </div>
                )}
              </div>
              {errors.backImage && <p className="text-red-500 text-xs mt-1">{errors.backImage}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="additional-info">Additional Information (Optional)</Label>
            <Textarea
              id="additional-info"
              placeholder="Add any additional information that might help with verification"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              If you have any special circumstances or if your document has any issues, please explain here.
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Submit for Verification
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
