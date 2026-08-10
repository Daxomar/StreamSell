import { Fraunces, Outfit } from "next/font/google"

export const liquidDisplay = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
})

export const liquidBody = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
})
