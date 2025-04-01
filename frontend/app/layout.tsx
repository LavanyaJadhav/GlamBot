import type { Metadata } from "next"
import { Montserrat, Playfair_Display as PlayfairDisplay, Dancing_Script as DancingScript } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { cn } from "@/lib/utils"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const playfair = PlayfairDisplay({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const dancing = DancingScript({
  subsets: ["latin"],
  variable: "--font-dancing",
})

export const metadata: Metadata = {
  title: "Glambot - AI Fashion Assistant",
  description: "Your personal AI-powered fashion assistant for style recommendations and outfit analysis",
  keywords: "fashion, AI, style recommendations, outfit analysis, personal stylist",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        montserrat.variable,
        playfair.variable,
        dancing.variable,
        montserrat.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

