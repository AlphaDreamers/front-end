import { AlertCircle, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
}

export function ConnectionStatus({ isConnected, error }: ConnectionStatusProps) {
  if (isConnected && !error) return null;

  return (
    <div className={cn(
      "flex items-center justify-center gap-2 px-4 py-2 text-sm",
      error ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
    )}>
      {error ? (
        <>
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Reconnecting...</span>
        </>
      )}
    </div>
  );
}