import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-10 w-64 mb-8" />

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Skeleton className="h-40 flex-1" />
        <Skeleton className="h-40 flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-96" />
        </div>
        <div>
          <Skeleton className="h-96" />
        </div>
      </div>
    </div>
  )
}
