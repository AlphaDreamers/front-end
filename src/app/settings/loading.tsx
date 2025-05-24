import { Loader2 } from "lucide-react"

export default function SettingsLoading() {
  return (
    <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[80vh]">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
        <p className="mt-4 text-lg text-gray-400">Loading settings...</p>
      </div>
    </div>
  )
}
