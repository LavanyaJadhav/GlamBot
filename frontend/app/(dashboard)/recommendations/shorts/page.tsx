"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Heart, ShoppingBag, Filter, Grid3X3, List, Palette, Shirt, Tag } from "lucide-react"
import Link from "next/link"

export default function ShortsRecommendationsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const recommendations = [
    {
      id: 1,
      title: "Beige Cargo Shorts",
      price: 899,
      image: "/cloths/Beige Cargo Shorts.jpg",
      link: "https://www.amazon.in/Souled-Store-Solids-Beige-Cargo/dp/B0D9B9HNG9/",
      type: "Same Color, Same Type",
      match: 98,
    },
    {
      id: 2,
      title: "Beige Chino Shorts",
      price: 799,
      image: "/cloths/Beige Chino Shorts.jpg",
      link: "https://www.amazon.in/Amazon-Brand-Regular-AW19-SHR-ESS-03_Light-Olive_38/dp/B07TMQQ4CC/",
      type: "Same Color, Different Type",
      match: 95,
    },
    {
      id: 3,
      title: "Khaki Cargo Shorts",
      price: 999,
      image: "/cloths/Khaki Cargo Shorts.jpg",
      link: "https://www.amazon.in/Symbol-Premium-Non-Iron-Cotton-Formal/dp/B0C3HPFDZ9/",
      type: "Different Color, Same Type",
      match: 92,
    },
    {
      id: 4,
      title: "Khaki Chino Shorts",
      price: 699,
      image: "/cloths/Khaki Chino Shorts.jpg",
      link: "https://www.amazon.in/Symbol-Premium-Non-Iron-Cotton-Formal/dp/B0C3HPFDZ9/",
      type: "Different Color, Different Type",
      match: 90,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-6 px-4 md:px-6">
        <div className="flex flex-col gap-4 md:gap-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Here are your recommendations</h1>
            <Button size="icon" variant="ghost">
              <Heart className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <Link href={item.link} key={item.id} target="_blank" rel="noopener noreferrer">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{item.title}</span>
                        <span className="text-sm text-gray-500">{item.match}% Match</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{item.type}</span>
                        <span className="font-semibold">₹{item.price}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 