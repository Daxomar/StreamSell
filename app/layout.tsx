import "./globals.css"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { SpeedInsights } from "@vercel/speed-insights/next"


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "StreamSell | Streaming Subscriptions",
  description: "Get Netflix, Spotify, HBO Max, and more streaming subscriptions delivered instantly via SMS. Fast, affordable, and reliable.",
  icons: {
    icon: "/stream-sell-white-exact.svg",
  },
  generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}