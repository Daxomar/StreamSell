import Link from "next/link"

export function LanderFooter({ theme = "light" }) {
  const isDark = theme === "dark" || theme === "neon"
  const bg = isDark ? "bg-black border-white/10 text-white/50" : "bg-white border-neutral-200 text-neutral-500"

  return (
    <footer className={`border-t py-8 ${bg}`}>
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <p className="text-sm">© {new Date().getFullYear()} Vendly. Built for vendors across Ghana.</p>
        <div className="flex gap-6 text-sm">
          <Link href="/vendor-landers" className="hover:underline">Variations</Link>
          <Link href="/vendor-auth/login" className="hover:underline">Login</Link>
          <Link href="/vendor-auth/register" className="hover:underline">Register</Link>
        </div>
      </div>
    </footer>
  )
}
