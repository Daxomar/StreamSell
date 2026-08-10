import Link from "next/link"
import { useUser,UserProvider } from "@/app/contexts/UserContext"
import { AuthProvider,useAuth } from "@/app/contexts/AuthContext"
import RoleGate from "@/app/contexts/RoleGate"




export default function VerificationAndResetLayout({ children }) {
  return (
    <div className="">
      <div className="">

        <AuthProvider>
        <UserProvider>
          <RoleGate allowedRoles={["user","admin"]}>
            {children}
          </RoleGate>
        </UserProvider>
        </AuthProvider>
      </div>
    </div>
  )
}