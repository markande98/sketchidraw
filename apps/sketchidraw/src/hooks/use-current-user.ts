import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();
  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
};
