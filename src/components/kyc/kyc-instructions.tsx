import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Camera, AlertTriangle } from "lucide-react";

export function KycInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          Document Requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Acceptable Documents</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Passport (recommended)</li>
            <li>Driver&apos;s License (front and back)</li>
            <li>National ID Card (front and back)</li>
            <li>Residence Permit</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Document Guidelines</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Documents must be valid and not expired</li>
            <li>Full document must be visible in the image</li>
            <li>All text and your photo must be clearly legible</li>
            <li>No glare or shadows covering important information</li>
            <li>Color images only (no black and white)</li>
            <li>File size: Maximum 5MB per image</li>
            <li>File formats: JPG, JPEG, PNG, or PDF</li>
          </ul>
        </div>

        <div className="bg-muted/20 p-4 rounded-lg border border-muted/30 mt-4">
          <div className="flex items-start gap-3">
            <Camera className="min-w-5 min-h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Taking a Good Photo</h3>
              <p className="text-sm text-muted-foreground">
                Place your document on a dark, non-reflective surface. Ensure
                good lighting and that your camera is focused. Take the photo
                directly above the document (not at an angle).
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="min-w-5 min-h-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-500 mb-1">Important</h3>
              <p className="text-sm text-yellow-500/90">
                Verification typically takes 1-3 business days. You&apos;ll
                receive an email notification once your documents have been
                reviewed. Submitting unclear or invalid documents will delay the
                verification process.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
