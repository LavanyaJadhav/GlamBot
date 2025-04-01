import type React from "react"
import { SideNav } from "@/components/side-nav"
import { Navbar } from "@/components/navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen pt-16">
        <SideNav />
        <main className="flex-1 pl-64">{children}</main>
      </div>
    </>
  )
}

