import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function useAuthForm<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = useCallback(
    async (
      action: (values: T) => Promise<void>,
      values: T,
      options?: {
        successMessage?: string;
        successRedirect?: string;
        onError?: (error: Error) => void;
      }
    ) => {
      setIsLoading(true);

      try {
        await action(values);

        if (options?.successMessage) {
          toast.success(options.successMessage);
        }

        if (options?.successRedirect) {
          router.push(options.successRedirect);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";

        toast.error(message);
        options?.onError?.(error as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return {
    isLoading,
    handleSubmit,
    searchParams,
    router,
  };
}
