"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { me } from "@/lib/actions";

type Session =
  | {
      user: null;
      status: "loading";
    }
  | {
      user: Awaited<ReturnType<typeof me>>;
      status: "authenticated";
    }
  | {
      user: null;
      status: "unauthenticated";
    };

const SessionContext = createContext<Session | null>(null);

const SessionProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session>({
    user: null,
    status: "loading",
  });

  useEffect(() => {
    const fetchSession = async () => {
      const user = await me();

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
