import { useMemo } from "react";

import { calculatePasswordStrength } from "@/lib/utils";

export const usePasswordStrength = (password: string) => {
  return useMemo(() => {
    const strength = calculatePasswordStrength(password);
    return {
      strength,
    };
  }, [password]);
};
