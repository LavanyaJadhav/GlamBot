"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Upload,
  Settings,
  Menu,
  X
} from "lucide-react"

const sidebarNavItems = [
  {
    title: "Home",
    href: "/dashboard",
    icon: <Home className="w-5 h-5" />
  },
  {
    title: "Upload",
    href: "/upload",
    icon: <Upload className="w-5 h-5" />
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="w-5 h-5" />
  }
]

export function SideNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Sidebar */}
      <div className={cn(
        "sticky top-0 h-[100dvh] w-64 border-r bg-background transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-16 px-6 flex items-center border-b">
          <h1 className="text-xl font-bold">
            Glam<span className="text-primary">bot</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-1.5 h-[calc(100dvh-4rem)] overflow-y-auto">
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* Toggle Button - Only show on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-20 p-2 bg-background rounded-lg shadow-md hover:bg-muted lg:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
} 