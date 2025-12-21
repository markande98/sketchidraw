import type { NextAuthConfig } from "next-auth";

export default {
  providers: [],
  pages: {
    signIn: "/auth/signin",
  },
} satisfies NextAuthConfig;
