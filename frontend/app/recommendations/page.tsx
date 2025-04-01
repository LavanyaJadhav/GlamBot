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

export default function RecommendationsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const colorPalette = [
    { color: "#0A2463", name: "Navy" },
    { color: "#E8C1C5", name: "Blush" },
    { color: "#D4AF37", name: "Gold" },
    { color: "#FFFFFF", name: "White" },
    { color: "#F5F5F5", name: "Light Gray" },
  ]

  const recommendations = [
    {
      id: 1,
      title: "Tailored Blazer",
      price: 129.99,
      image: "/placeholder.svg?height=400&width=300",
      colors: ["#0A2463", "#000000", "#F5F5F5"],
      match: 98,
    },
    {
      id: 2,
      title: "Silk Blouse",
      price: 89.99,
      image: "/placeholder.svg?height=400&width=300",
      colors: ["#E8C1C5", "#FFFFFF", "#0A2463"],
      match: 95,
    },
    {
      id: 3,
      title: "Wide-Leg Pants",
      price: 79.99,
      image: "/placeholder.svg?height=400&width=300",
      colors: ["#0A2463", "#000000"],
      match: 92,
    },
    {
      id: 4,
      title: "Statement Necklace",
      price: 49.99,
      image: "/placeholder.svg?height=400&width=300",
      colors: ["#D4AF37"],
      match: 90,
    },
    {
      id: 5,
      title: "Leather Handbag",
      price: 159.99,
      image: "/placeholder.svg?height=400&width=300",
      colors: ["#0A2463", "#000000"],
      match: 88,
    },
    {
      id: 6,
      title: "Cashmere Sweater",
      price: 149.99,
      image: "/placeholder.svg?height=400&width=300",
      colors: ["#E8C1C5", "#F5F5F5", "#0A2463"],
      match: 85,
    },
  ]

  const filteredRecommendations = recommendations.filter(
    (item) => item.price >= priceRange[0] && item.price <= priceRange[1],
  )

  if (!mounted) return null

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-12 gradient-bg">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-playfair font-bold">Your Personalized Recommendations</h1>
            <p className="text-muted-foreground mt-2">
              Based on your uploaded Summer Dress, we've curated these items to complement your style
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-playfair font-bold flex items-center mb-4">
                      <Filter className="h-4 w-4 mr-2" /> Filters
                    </h3>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                          <Tag className="h-4 w-4 mr-2" /> Price Range
                        </h4>
                        <div className="pt-4 px-2">
                          <Slider
                            defaultValue={[0, 500]}
                            max={500}
                            step={10}
                            value={priceRange}
                            onValueChange={setPriceRange}
                          />
                          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                          <Palette className="h-4 w-4 mr-2" /> Color Palette
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {colorPalette.map((color, index) => (
                            <div key={index} className="group relative">
                              <div
                                className="w-8 h-8 rounded-full border cursor-pointer"
                                style={{ backgroundColor: color.color }}
                              />
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background text-xs px-2 py-1 rounded shadow whitespace-nowrap">
                                {color.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                          <Shirt className="h-4 w-4 mr-2" /> Categories
                        </h4>
                        <div className="space-y-1 mt-2">
                          {["Tops", "Bottoms", "Dresses", "Outerwear", "Accessories"].map((category, index) => (
                            <div key={index} className="flex items-center">
                              <input type="checkbox" id={`category-${index}`} className="mr-2" />
                              <label htmlFor={`category-${index}`} className="text-sm cursor-pointer">
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90">Apply Filters</Button>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex justify-between items-center">
                <Tabs defaultValue="recommended">
                  <TabsList>
                    <TabsTrigger value="recommended">Recommended</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-primary hover:bg-primary/90" : ""}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-primary hover:bg-primary/90" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div
                className={`
                ${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}
              `}
              >
                {filteredRecommendations.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`
                      border rounded-lg overflow-hidden card-hover
                      ${viewMode === "list" ? "flex" : ""}
                    `}
                  >
                    <div
                      className={`
                      relative 
                      ${viewMode === "grid" ? "aspect-[3/4]" : "w-1/3 aspect-square"}
                    `}
                    >
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-background/80 backdrop-blur-sm hover:bg-background"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <div className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                          {item.match}% Match
                        </div>
                      </div>
                    </div>

                    <div
                      className={`
                      p-4 
                      ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}
                    `}
                    >
                      <div>
                        <h3 className="font-playfair font-bold">{item.title}</h3>
                        <p className="text-lg font-medium mt-1">${item.price.toFixed(2)}</p>

                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Available Colors:</p>
                          <div className="flex gap-1">
                            {item.colors.map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button className="mt-4 w-full bg-primary hover:bg-primary/90">
                        <ShoppingBag className="mr-2 h-4 w-4" /> Add to Bag
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredRecommendations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No items match your current filters. Try adjusting your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

