"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"

  if (isLandingPage) {
    return (
      <div className="min-h-screen">
        <Navbar />
        {children}
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 pb-12">
        <main>
          {children}
        </main>
      </div>
    </div>
  )
} 