"use client";

import { me } from "@/lib/actions";
import { User } from "@prisma/client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

interface SessionContextType {
  user: User | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  isLoading: true,
});

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      /**
       *const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
       *   method: "GET",
       *   credentials: "include",
       *   headers: {
       *     "Content-Type": "application/json",
       *   },
       * });
       * if (!res.ok) {
       *   const error = await res.json();
       *   throw new Error(error.message);
       * }
       * const data = await res.json();
       * setUser(data.user);
       */
      try {
        const currentUser = await me();
        if (isMounted) setUser(currentUser);
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    getUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SessionContext.Provider value={{ user, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useUser = (): SessionContextType => useContext(SessionContext);
