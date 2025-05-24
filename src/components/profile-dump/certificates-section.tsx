import type { Certificate } from "@/lib/data"
import { Award, CheckCircle } from "lucide-react"

interface CertificatesSectionProps {
  certificates: Certificate[]
}

export function CertificatesSection({ certificates }: CertificatesSectionProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Certificates</h2>
      <div className="grid grid-cols-1 gap-4">
        {certificates.map((certificate) => (
          <div
            key={certificate.name}
            className="flex items-start p-4 rounded-lg border border-muted/20 bg-muted/10 hover:bg-muted/20 transition-colors group"
          >
            <div className="mr-4 mt-1">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Award className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-semibold">{certificate.name}</h3>
                {certificate.verified && (
                  <span className="ml-2 text-green-500">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Issued by {certificate.issuer} • {new Date(certificate.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
