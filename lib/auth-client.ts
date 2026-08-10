import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // http://localhost:5000
  plugins: [adminClient()],   // matches the admin() plugin on your backend
});

// Convenient re-exports
export const { signIn, signUp, signOut, useSession } = authClient;