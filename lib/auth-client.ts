import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;
const ac = createAccessControl(statement);
const adminRole = ac.newRole({
  ...adminAc.statements,
});
const managerRole = ac.newRole({});
const userRole = ac.newRole({});

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, 
   plugins: [
    adminClient({
      ac,
      roles: {
        admin: adminRole,
        manager: managerRole,
        user: userRole,
      },
    }),
  ], 
});

// Convenient re-exports
export const { signIn, signUp, signOut, useSession } = authClient;