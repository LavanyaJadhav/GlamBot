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
import Image from "next/image"
import Link from "next/link"

export default function SweaterRecommendationsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const recommendations = [
    {
      id: 1,
      title: "Maroon V-Neck Sweater",
      price: 1299,
      image: "https://m.media-amazon.com/images/I/71cFpnm0D6L._SX522_.jpg",
      link: "https://www.amazon.in/Monte-Carlo-Maroon-Pullover-1240566VN-2344-46/dp/B0DLGRVGSC/",
      type: "Same Color, Same Type",
      match: 98,
    },
    {
      id: 2,
      title: "Maroon Crew Neck Sweater",
      price: 1199,
      image: "https://m.media-amazon.com/images/I/61Q2VD7sGLL._SX522_.jpg",
      link: "https://www.amazon.in/GODFREY-Acrylic-Sweater-GFA70396386P_Burgundy_3XL_Maroon-Burgundy_3XL/dp/B0B526GL1S/",
      type: "Same Color, Different Type",
      match: 95,
    },
    {
      id: 3,
      title: "Navy Blue V-Neck Sweater",
      price: 1499,
      image: "https://m.media-amazon.com/images/I/71ww7sZn3FL._SX522_.jpg",
      link: "https://www.amazon.in/MANRA-Pullower-Sweater-Pullover-Blue_Free/dp/B0BCQZHT65/",
      type: "Different Color, Same Type",
      match: 92,
    },
    {
      id: 4,
      title: "Navy Blue Crew Neck Sweater",
      price: 999,
      image: "https://m.media-amazon.com/images/I/61dZ5AOGbNL._SX522_.jpg",
      link: "https://www.amazon.in/Amazon-Brand-Acrylic-Pullover-SYM-A23-SWT-06_Navy_M/dp/B0CB2YP97X/",
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
            <h1 className="text-2xl font-bold">Sweater Recommendations</h1>
            <Button size="icon" variant="ghost">
              <Heart className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((item) => (
              <Link href={item.link} key={item.id} target="_blank" rel="noopener noreferrer">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-2"
                      priority
                      unoptimized // Required for external images
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