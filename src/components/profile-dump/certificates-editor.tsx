"use client"

import type React from "react"

import { useState } from "react"
import { Plus, X, FileText, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Certificate } from "@/lib/mock-data"

interface CertificatesEditorProps {
  certificates: Certificate[]
  onChange: (certificates: Certificate[]) => void
}

export function CertificatesEditor({ certificates, onChange }: CertificatesEditorProps) {
  const [newCertName, setNewCertName] = useState("")
  const [newCertIssuer, setNewCertIssuer] = useState("")
  const [newCertFile, setNewCertFile] = useState<File | null>(null)
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setNewCertFile(file)
  }

  const handleAddCertificate = () => {
    if (!newCertName) {
      setError("Certificate name is required")
      return
    }

    if (!newCertIssuer) {
      setError("Issuer name is required")
      return
    }

    if (!newCertFile) {
      setError("Certificate file is required")
      return
    }

    const newCertificate: Certificate = {
      id: `cert-${Date.now()}`,
      name: newCertName,
      issuer: newCertIssuer,
      file: newCertFile.name,
      status: "pending",
    }

    onChange([...certificates, newCertificate])

    // Reset form
    setNewCertName("")
    setNewCertIssuer("")
    setNewCertFile(null)
    setError("")

    // Reset file input
    const fileInput = document.getElementById("certificate-file") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleRemoveCertificate = (id: string) => {
    const updatedCertificates = certificates.filter((cert) => cert.id !== id)
    onChange(updatedCertificates)
  }

  const getStatusIcon = (status: Certificate["status"]) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: Certificate["status"]) => {
    switch (status) {
      case "verified":
        return "Verified"
      case "rejected":
        return "Rejected"
      case "pending":
        return "Pending Verification"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cert-name">Certificate Name</Label>
          <Input
            id="cert-name"
            value={newCertName}
            onChange={(e) => setNewCertName(e.target.value)}
            placeholder="e.g., Blockchain Developer Certification"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="cert-issuer">Issuing Organization</Label>
          <Input
            id="cert-issuer"
            value={newCertIssuer}
            onChange={(e) => setNewCertIssuer(e.target.value)}
            placeholder="e.g., Blockchain Council"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="certificate-file">Upload Certificate (PDF, JPG, PNG)</Label>
        <div className="mt-1 flex items-center gap-3">
          <Input
            id="certificate-file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="flex-1"
          />
          <Button type="button" onClick={handleAddCertificate} className="flex gap-1 items-center whitespace-nowrap">
            <Plus className="h-4 w-4" /> Add Certificate
          </Button>
        </div>
        {newCertFile && <p className="text-xs text-muted-foreground mt-1">Selected file: {newCertFile.name}</p>}
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="space-y-3 mt-4">
        {certificates.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">No certificates added yet</p>
        ) : (
          certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex items-start justify-between p-3 rounded-md border border-muted/30 bg-muted/10 group hover:border-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <div className="font-medium">{cert.name}</div>
                  <div className="text-sm text-muted-foreground">Issued by {cert.issuer}</div>
                  <div className="flex items-center gap-1 mt-1 text-xs">
                    {getStatusIcon(cert.status)}
                    <span
                      className={`${
                        cert.status === "verified"
                          ? "text-green-500"
                          : cert.status === "rejected"
                            ? "text-destructive"
                            : "text-yellow-500"
                      }`}
                    >
                      {getStatusText(cert.status)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveCertificate(cert.id)}
                className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={cert.status === "verified"}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Note: Certificates will be reviewed by our team for verification. This process typically takes 1-2 business
        days.
      </p>
    </div>
  )
}
