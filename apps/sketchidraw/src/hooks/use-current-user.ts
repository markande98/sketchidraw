import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User } from "./use-e2e-websocket";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!session?.user?.id || !session.user.name || status !== "authenticated")
      return;
    setCurrentUser({
      id: session.user.id,
      username: session.user.name,
      cursorPos: { x: 0, y: 0 },
    });
  }, [session?.user?.id, session?.user?.name, status]);

  return {
    currentUser,
    isAuthenticated: status === "authenticated",
  };
};
