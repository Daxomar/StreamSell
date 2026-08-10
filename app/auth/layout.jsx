import Link from "next/link"
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="w-full flex flex-col  gap-6">
        
        {children}
      </div>
    </div>
  )
}
