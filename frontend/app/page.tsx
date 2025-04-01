"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Camera, Sparkles, Palette, Shirt } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const features = [
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Smart Image Analysis",
      description: "Upload your clothing items and let our AI analyze them in detail.",
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Color Matching",
      description: "Get perfect color combinations and style recommendations.",
    },
    {
      icon: <Shirt className="h-6 w-6" />,
      title: "Style Recommendations",
      description: "Discover new outfits that match your personal style.",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 gradient-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-playfair font-bold tracking-tight">
            Your AI-Powered{" "}
            <span className="text-primary">Fashion Assistant</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your wardrobe with AI-powered fashion analysis and personalized style recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/login">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24 px-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/50 to-accent/50 opacity-0 group-hover:opacity-100 transition duration-300" />
              <div className="relative p-6 bg-card rounded-lg space-y-4">
                <div className="p-3 bg-primary/10 rounded-full w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        </motion.div>
      </section>
    </main>
  )
}

