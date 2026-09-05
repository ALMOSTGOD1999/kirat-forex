import { useEffect, useState } from "react";
import { AUTH_EVENT, currentUser, type AppUser } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const sync = async () => setUser(await currentUser());
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { user, isAdmin: user?.role === "admin" };
}
