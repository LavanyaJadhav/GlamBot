"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Moon, Sun, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Image from "next/image"

interface UserData {
  userId: number;
  username: string;
  name: string;
}

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const userDataString = localStorage.getItem('userData')
    if (userDataString) {
      setUserData(JSON.parse(userDataString))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userData')
    router.push('/login')
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/upload", label: "Upload" },
    { href: "/settings", label: "Settings" },
  ]

  if (!mounted) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-serif">
            Glam<span className="text-accent">bot</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="relative py-5">
                {link.label}
                {pathname === link.href && (
                  <motion.div layoutId="underline" className="absolute left-0 right-0 bottom-0 h-0.5 bg-accent" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Link>
            </Button>
            {userData ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-sm font-medium"
              >
                Logout
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

