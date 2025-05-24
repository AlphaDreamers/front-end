"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, Loader2 } from "lucide-react"
import type { Gig, GigPackage } from "@/lib/mock-data"
import { gigCategories } from "@/lib/mock-data"

interface GigFormProps {
  gig?: Gig
  open: boolean
  onClose: () => void
  onSave: (gig: Partial<Gig>) => void
}

export function GigForm({ gig, open, onClose, onSave }: GigFormProps) {
  const isEditing = !!gig

  const [formData, setFormData] = useState<Partial<Gig>>(
    gig || {
      title: "",
      description: "",
      category: "",
      subcategory: "",
      tags: [],
      packages: [
        {
          id: `pkg-${Date.now()}-1`,
          name: "basic",
          description: "",
          deliveryTime: 3,
          revisions: 1,
          price: 0.5,
        },
        {
          id: `pkg-${Date.now()}-2`,
          name: "standard",
          description: "",
          deliveryTime: 7,
          revisions: 2,
          price: 1,
        },
        {
          id: `pkg-${Date.now()}-3`,
          name: "premium",
          description: "",
          deliveryTime: 14,
          revisions: 3,
          price: 2,
        },
      ],
      images: [],
      status: "inactive",
    },
  )

  const [activeTab, setActiveTab] = useState("overview")
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    // Reset subcategory when category changes
    if (name === "category") {
      setFormData((prev) => ({ ...prev, subcategory: "" }))
    }
  }

  const handleAddTag = () => {
    if (!tagInput.trim()) return

    const newTag = tagInput.trim()
    if (formData.tags?.includes(newTag)) return

    setFormData((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), newTag],
    }))
    setTagInput("")
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }))
  }

  const handlePackageChange = (packageId: string, field: keyof GigPackage, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages?.map((pkg) => (pkg.id === packageId ? { ...pkg, [field]: value } : pkg)),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (formData.packages?.some((pkg) => !pkg.description.trim())) {
      newErrors.packages = "All package descriptions are required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      setActiveTab("overview")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave(formData)
    } catch (error) {
      console.error("Error saving gig:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSubcategories = () => {
    const selectedCategory = gigCategories.find((cat) => cat.name === formData.category)
    return selectedCategory?.subcategories || []
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Gig" : "Create New Gig"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your gig details to attract more clients."
              : "Fill in the details below to create a new gig."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="packages">Packages & Pricing</TabsTrigger>
            <TabsTrigger value="images">Images & Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Gig Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="I will..."
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
              <p className="text-xs text-muted-foreground">
                Create a clear, concise title that describes your service.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your service in detail..."
                rows={6}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
              <p className="text-xs text-muted-foreground">
                Provide a detailed description of your service, including what clients will receive.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {gigCategories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) => handleSelectChange("subcategory", value)}
                  disabled={!formData.category}
                >
                  <SelectTrigger id="subcategory">
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubcategories().map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag} disabled={!tagInput.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-muted/30 hover:bg-muted/50 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 rounded-full hover:bg-muted/50 p-0.5"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag}</span>
                    </button>
                  </Badge>
                ))}
                {formData.tags?.length === 0 && (
                  <p className="text-xs text-muted-foreground">No tags added yet. Tags help clients find your gig.</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
            {errors.packages && <p className="text-red-500 text-xs">{errors.packages}</p>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.packages?.map((pkg) => (
                <div
                  key={pkg.id}
                  className="border rounded-lg p-4 space-y-3 hover:border-purple-500/50 transition-colors"
                >
                  <div className="text-center pb-2 border-b border-border/50">
                    <h3 className="font-semibold capitalize">{pkg.name}</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${pkg.id}-description`}>Description</Label>
                    <Textarea
                      id={`${pkg.id}-description`}
                      value={pkg.description}
                      onChange={(e) => handlePackageChange(pkg.id, "description", e.target.value)}
                      placeholder="What's included in this package..."
                      rows={3}
                      className={errors.packages && !pkg.description ? "border-red-500" : ""}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`${pkg.id}-delivery`}>Delivery Time (days)</Label>
                      <Input
                        id={`${pkg.id}-delivery`}
                        type="number"
                        min="1"
                        value={pkg.deliveryTime}
                        onChange={(e) =>
                          handlePackageChange(pkg.id, "deliveryTime", Number.parseInt(e.target.value) || 1)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${pkg.id}-revisions`}>Revisions</Label>
                      <Input
                        id={`${pkg.id}-revisions`}
                        type="number"
                        min="0"
                        value={pkg.revisions}
                        onChange={(e) => handlePackageChange(pkg.id, "revisions", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${pkg.id}-price`}>Price (SOL)</Label>
                    <Input
                      id={`${pkg.id}-price`}
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={pkg.price}
                      onChange={(e) => handlePackageChange(pkg.id, "price", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              Offer different packages to cater to various client needs and budgets. Each package should provide clear
              value.
            </p>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div className="border-2 border-dashed border-muted/50 rounded-lg p-8 text-center hover:border-purple-500/50 transition-colors">
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">Upload Gig Images</h3>
                <p className="text-sm text-muted-foreground mb-4">Drag and drop your images here, or click to browse</p>
                <Button variant="outline">Select Images</Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB per image.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images && formData.images.length > 0 ? (
                formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden border border-muted/50 group"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Gig image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images?.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground text-sm">
                  No images uploaded yet. Add at least one image to showcase your work.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="sm:flex-1">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : isEditing ? (
              "Update Gig"
            ) : (
              "Create Gig"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
