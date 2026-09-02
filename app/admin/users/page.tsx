// "use client"
// import { useState } from "react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from "@/components/ui/select"
// import {
//   Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
// } from "@/components/ui/dialog"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Search, Loader2 } from "lucide-react"
// import { authClient } from "@/lib/auth-client"
// import toast from "react-hot-toast"

// // ── Dummy data for UI approval ──
// const DUMMY_STAFF = [
//   { id: "1", name: "David Onyebuchi", email: "daxohnero@gmail.com", role: "admin" },
//   { id: "2", name: "Kwame Mensah", email: "kwame@example.com", role: "manager" },
//   { id: "3", name: "Ama Boateng", email: "ama@example.com", role: "manager" },
// ]

// const DUMMY_SEARCH = [
//   { id: "9", name: "John Reseller", email: "john@example.com", role: "user" },
// ]

// const ROLE_STYLES: Record<string, string> = {
//   admin: "bg-purple-100 text-purple-700 border-purple-200",
//   manager: "bg-blue-100 text-blue-700 border-blue-200",
//   user: "bg-slate-100 text-slate-600 border-slate-200",
//   reseller: "bg-slate-100 text-slate-600 border-slate-200",
// }

// export default function UsersRolesPage() {
//   const [tab, setTab] = useState<"staff" | "search">("staff")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [isSearching, setIsSearching] = useState(false)

//   // role-change confirmation
//   const [confirmOpen, setConfirmOpen] = useState(false)
//   const [target, setTarget] = useState<{ id: string; name: string; email: string; currentRole: string; newRole: string } | null>(null)
//   const [assigning, setAssigning] = useState(false)

//   // dummy — replace with real data
//   const staff = DUMMY_STAFF
//   const searchResults = searchTerm ? DUMMY_SEARCH : []

//   const handleSearch = () => {
//     if (!searchTerm.trim()) return
//     setIsSearching(true)
//     setTab("search")
//     // TODO: real search
//     setTimeout(() => setIsSearching(false), 500)
//   }

//   const requestRoleChange = (user: { id: string; name: string; email: string; role: string }, newRole: string) => {
//     if (newRole === user.role) return
//     setTarget({ id: user.id, name: user.name, email: user.email, currentRole: user.role, newRole })
//     setConfirmOpen(true)
//   }

// const confirmRoleChange = async () => {
//   if (!target) return
//   setAssigning(true)
//   try {
//     const { error } = await authClient.admin.setRole({
//       userId: target.id,
//       role: target.newRole as "admin" | "manager" | "user",
//     })
//     if (error) throw new Error(error.message || "Failed to change role")

//     toast.success(`${target.name} is now ${target.newRole}`)
//     setConfirmOpen(false)
//     setTarget(null)
//     // (piece #2 will add: refetch the list)
//   } catch (err: any) {
//     toast.error(err.message || "Failed to change role")
//   } finally {
//     setAssigning(false)
//   }
// }

//   const rows = tab === "staff" ? staff : searchResults

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h2 className="text-3xl font-bold">Users & Roles</h2>
//         <p className="text-muted-foreground">Manage staff roles. Search by email or name to assign a role to any user.</p>
//       </div>
//       {/* Search bar */}
//       <div className="flex gap-2">
//         <div className="relative flex-1">
//          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
//           <Input
//             placeholder="Search by email or name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//             className="
//               w-full pl-10 
//               py-2
//               rounded-lg
//               border border-[#EEEEEE]
//               bg-gray-200/50
//               focus:outline-none
//               focus:ring-2
//               focus:ring-gray-500/20
//               placeholder:text-gray-500
//               transition-all
//               "
//           />
//         </div>
//         <Button onClick={handleSearch} className="bg-[#262626] hover:bg-[#3a3a3a] text-white">
//           Search
//         </Button>
//       </div>

//       {/* Tabs */}
//       <Tabs value={tab} onValueChange={(v: any) => setTab(v)} className="w-full">
//         <TabsList className="border border-gray-200/50 bg-gray-200/50 rounded-md px-2 py-5 gap-2">
//           <TabsTrigger
//             value="staff"
//             className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-200 p-4 rounded-md text-gray-500 font-medium"
//           >
//             Staff (Admins & Managers)
//           </TabsTrigger>
//           <TabsTrigger
//             value="search"
//             className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-200 p-4 rounded-md text-gray-500 font-medium"
//           >
//             Search Results{searchTerm ? ` (${searchResults.length})` : ""}
//           </TabsTrigger>
//         </TabsList>
//       </Tabs>

//       {/* List */}
//       <Card className="w-full border-none shadow-none py-2">
//         {isSearching ? (
//           <div className="flex justify-center py-12">
//             <Loader2 className="h-8 w-8 animate-spin text-[#262626]" />
//           </div>
//         ) : rows.length === 0 ? (
//           <div className="text-center py-12 text-slate-500">
//             {tab === "search"
//               ? "No users found. Try a different email or name."
//               : "No staff yet."}
//           </div>
//         ) : (
//           <div className="divide-y divide-slate-100">
//             {/* header row (desktop) */}
//             <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1.5fr] gap-4 px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
//               <span>Name</span>
//               <span>Email</span>
//               <span>Current Role</span>
//               <span>Assign Role</span>
//             </div>

//             {rows.map((user) => (
//               <div
//                 key={user.id}
//                 className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1.5fr] gap-2 md:gap-4 px-4 py-4 items-center hover:bg-slate-50 transition-colors"
//               >
//                 <div className="font-medium text-slate-900">{user.name}</div>
//                 <div className="text-sm text-slate-500 truncate">{user.email}</div>
//                 <div>
//                   <Badge variant="outline" className={`uppercase text-xs ${ROLE_STYLES[user.role] || ROLE_STYLES.user}`}>
//                     {user.role}
//                   </Badge>
//                 </div>
//                 <div>
//                   <Select value={user.role} onValueChange={(value) => requestRoleChange(user, value)}>
//                     <SelectTrigger className="w-full md:w-[150px]">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className=" border-1 border-black/5">
//                       <SelectItem className="" value="admin">Admin</SelectItem>
//                       <SelectItem className="" value="manager">Manager</SelectItem>
//                       <SelectItem className="" value="user">User</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </Card>

//       {/* Confirm role change */}
//       <Dialog open={confirmOpen} onOpenChange={setConfirmOpen} classname="border-none">
//         <DialogContent className="sm:max-w-md border-none">
//           <DialogHeader className="">
//             <DialogTitle className="">Change Role?</DialogTitle>
//             <DialogDescription className="">Confirm this role assignment.</DialogDescription>
//           </DialogHeader>
//           {target && (
//             <div className="py-2">
//               <div className="rounded-lg border-2 border-[#262626]/10 bg-slate-50 p-5">
//                 <p className="text-sm text-slate-500">Change role for</p>
//                 <p className="text-xl font-bold text-[#262626] mt-1">{target.name}</p>
//                 <p className="font-mono text-sm text-slate-700 mt-1">{target.email}</p>
//                 <div className="mt-3 pt-3 border-t flex items-center justify-center gap-3">
//                   <Badge variant="outline" className={`uppercase ${ROLE_STYLES[target.currentRole] || ROLE_STYLES.user}`}>
//                     {target.currentRole}
//                   </Badge>
//                   <span className="text-slate-400">→</span>
//                   <Badge variant="outline" className={`uppercase ${ROLE_STYLES[target.newRole] || ROLE_STYLES.user}`}>
//                     {target.newRole}
//                   </Badge>
//                 </div>
//               </div>
//             </div>
//           )}
//           <DialogFooter className="">
//             <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={assigning}>
//               Cancel
//             </Button>
//             <Button
//               className="bg-[#262626] hover:bg-[#3a3a3a] text-white"
//               disabled={assigning}
//               onClick={confirmRoleChange}
//             >
//               {assigning ? "Assigning..." : "Confirm Change"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }





"use client"
import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import toast from "react-hot-toast"

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  manager: "bg-blue-100 text-blue-700 border-blue-200",
  user: "bg-slate-100 text-slate-600 border-slate-200",
  reseller: "bg-slate-100 text-slate-600 border-slate-200",
}

type UserRow = { id: string; name: string; email: string; role: string }

export default function UsersRolesPage() {
  const [tab, setTab] = useState<"staff" | "search">("staff")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const [staff, setStaff] = useState<UserRow[]>([])
  const [staffLoading, setStaffLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<UserRow[]>([])

  // role-change confirmation
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [target, setTarget] = useState<{ id: string; name: string; email: string; currentRole: string; newRole: string } | null>(null)
  const [assigning, setAssigning] = useState(false)

  // normalize a BetterAuth user → our row shape
  const toRow = (u: any): UserRow => ({
    id: u.id,
    name: u.name || "—",
    email: u.email,
    role: u.role || "user",
  })

  // ── Fetch staff (admins + managers) ──
  const fetchStaff = useCallback(async () => {
    setStaffLoading(true)
    try {
      // BetterAuth listUsers supports filtering. Fetch admins + managers.
      const { data, error } = await authClient.admin.listUsers({
        query: {
          limit: 100,
          // filter by role — see note below if this doesn't narrow server-side
        },
      })
      if (error) throw new Error(error.message || "Failed to load users")

      const users = (data?.users || []).map(toRow)
      // keep only admins + managers for the staff tab
      const staffOnly = users.filter((u) => u.role === "admin" || u.role === "manager")
      setStaff(staffOnly)
    } catch (err: any) {
      toast.error(err.message || "Failed to load staff")
    } finally {
      setStaffLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStaff()
  }, [fetchStaff])

  // ── Search users by email or name (any role) ──
  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    setIsSearching(true)
    setTab("search")
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          searchValue: searchTerm.trim(),
          searchField: "email",     // BetterAuth searches this field
          searchOperator: "contains",
          limit: 50,
        },
      })
      if (error) throw new Error(error.message || "Search failed")

      let users = (data?.users || []).map(toRow)

      // if email search returns nothing, try name
      if (users.length === 0) {
        const nameRes = await authClient.admin.listUsers({
          query: {
            searchValue: searchTerm.trim(),
            searchField: "name",
            searchOperator: "contains",
            limit: 50,
          },
        })
        users = (nameRes.data?.users || []).map(toRow)
      }

      setSearchResults(users)
    } catch (err: any) {
      toast.error(err.message || "Search failed")
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const requestRoleChange = (user: { id: string; name: string; email: string; role: string }, newRole: string) => {
    if (newRole === user.role) return
    setTarget({ id: user.id, name: user.name, email: user.email, currentRole: user.role, newRole })
    setConfirmOpen(true)
  }

  const confirmRoleChange = async () => {
    if (!target) return
    setAssigning(true)
    try {
      const { error } = await authClient.admin.setRole({
        userId: target.id,
        role: target.newRole as "admin" | "manager" | "user",
      })
      if (error) throw new Error(error.message || "Failed to change role")

      toast.success(`${target.name} is now ${target.newRole}`)
      setConfirmOpen(false)
      setTarget(null)

      // refresh whichever list is showing
      fetchStaff()
      if (tab === "search" && searchTerm.trim()) handleSearch()
    } catch (err: any) {
      toast.error(err.message || "Failed to change role")
    } finally {
      setAssigning(false)
    }
  }

  const rows = tab === "staff" ? staff : searchResults
  const listLoading = tab === "staff" ? staffLoading : isSearching

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Users & Roles</h2>
        <p className="text-muted-foreground">Manage staff roles. Search by email or name to assign a role to any user.</p>
      </div>

      {/* Search bar — your styling, unchanged */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="
              w-full pl-10 
              py-2
              rounded-lg
              border border-[#EEEEEE]
              bg-gray-200/50
              focus:outline-none
              focus:ring-2
              focus:ring-gray-500/20
              placeholder:text-gray-500
              transition-all
              "
          />
        </div>
        <Button onClick={handleSearch} className="bg-[#262626] hover:bg-[#3a3a3a] text-white">
          Search
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v: any) => setTab(v)} className="w-full">
        <TabsList className="border border-gray-200/50 bg-gray-200/50 rounded-md px-2 py-5 gap-2">
          <TabsTrigger
            value="staff"
            className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-200 p-4 rounded-md text-gray-500 font-medium"
          >
            Staff (Admins & Managers)
          </TabsTrigger>
          <TabsTrigger
            value="search"
            className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-200 p-4 rounded-md text-gray-500 font-medium"
          >
            Search Results{searchTerm ? ` (${searchResults.length})` : ""}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* List */}
      <Card className="w-full border-none shadow-none py-2">
        {listLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#262626]" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            {tab === "search"
              ? "No users found. Try a different email or name."
              : "No staff yet."}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {/* header row (desktop) */}
            <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1.5fr] gap-4 px-4 py-3 text-xs font-semibold text-slate-400 uppercase">
              <span>Name</span>
              <span>Email</span>
              <span>Current Role</span>
              <span>Assign Role</span>
            </div>

            {rows.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1.5fr] gap-2 md:gap-4 px-4 py-4 items-center hover:bg-slate-50 transition-colors"
              >
                <div className="font-medium text-slate-900">{user.name}</div>
                <div className="text-sm text-slate-500 truncate">{user.email}</div>
                <div>
                  <Badge variant="outline" className={`uppercase text-xs ${ROLE_STYLES[user.role] || ROLE_STYLES.user}`}>
                    {user.role}
                  </Badge>
                </div>
                <div>
                  <Select value={user.role} onValueChange={(value) => requestRoleChange(user, value)}>
                    <SelectTrigger className="w-full md:w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-1 border-black/5">
                      <SelectItem className="" value="admin">Admin</SelectItem>
                      <SelectItem className="" value="manager">Manager</SelectItem>
                      <SelectItem className="" value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Confirm role change */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md border-none">
          <DialogHeader className="">
            <DialogTitle className="">Change Role?</DialogTitle>
            <DialogDescription className="">Confirm this role assignment.</DialogDescription>
          </DialogHeader>
          {target && (
            <div className="py-2">
              <div className="rounded-lg border-2 border-[#262626]/10 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Change role for</p>
                <p className="text-xl font-bold text-[#262626] mt-1">{target.name}</p>
                <p className="font-mono text-sm text-slate-700 mt-1">{target.email}</p>
                <div className="mt-3 pt-3 border-t flex items-center justify-center gap-3">
                  <Badge variant="outline" className={`uppercase ${ROLE_STYLES[target.currentRole] || ROLE_STYLES.user}`}>
                    {target.currentRole}
                  </Badge>
                  <span className="text-slate-400">→</span>
                  <Badge variant="outline" className={`uppercase ${ROLE_STYLES[target.newRole] || ROLE_STYLES.user}`}>
                    {target.newRole}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="">
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={assigning}>
              Cancel
            </Button>
            <Button
              className="bg-[#262626] hover:bg-[#3a3a3a] text-white"
              disabled={assigning}
              onClick={confirmRoleChange}
            >
              {assigning ? "Assigning..." : "Confirm Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
