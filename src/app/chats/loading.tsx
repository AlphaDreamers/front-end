import { Skeleton } from "@/components/ui/skeleton";

export default function MessagesLoading() {
  return (
    <div className="flex h-screen bg-background">
      <div className="w-full md:w-80 lg:w-96 h-full border-r border-border">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-8 w-40 mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <div className="flex-1">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 border-b border-border"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="hidden md:flex flex-col flex-1 h-full">
        <div className="flex items-center p-4 border-b border-border">
          <Skeleton className="h-10 w-10 rounded-full mr-3" />
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                {i % 2 === 0 && (
                  <Skeleton className="h-8 w-8 rounded-full mr-2" />
                )}
                <Skeleton
                  className={`h-20 ${i % 2 === 0 ? "w-64" : "w-72"} rounded-lg`}
                />
              </div>
            ))}
        </div>
        <div className="p-4 border-t border-border">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
