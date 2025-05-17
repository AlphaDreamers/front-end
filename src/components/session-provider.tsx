"use client";

import { User } from "@prisma/client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCurrentUser } from "@/lib/actions";

interface Session {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

const SessionContext = createContext<Session | null>(null);

const SessionProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session>({
    user: null,
    status: "loading",
  });

  useEffect(() => {
    const fetchSession = async () => {
      const user = await getCurrentUser();

      if (user) {
        setSession({
          user,
          status: "authenticated",
        });
      } else {
        setSession({
          user: null,
          status: "unauthenticated",
        });
      }
    };

    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
