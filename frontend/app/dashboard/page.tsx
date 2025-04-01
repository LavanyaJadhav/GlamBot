"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Grid3X3, List, Shirt, TrendingUp, Palette, Heart, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { ColorAnalysis } from "@/components/ColorAnalysis"
import { StyleProfile } from "@/components/style-profile"

interface UserData {
  userId: number;
  username: string;
  name: string;
}

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [greeting, setGreeting] = useState('')
  const [error, setError] = useState<string | null>(null)

  const trendingItems = ["Oversized Blazers", "Wide-Leg Pants", "Statement Collars", "Chunky Loafers", "Pastel Hues"]

  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem('userData')
    if (!userDataString) {
      console.error('No user data found')
      router.push('/login')
      return
    }

    const parsedUserData: UserData = JSON.parse(userDataString)
    setUserData(parsedUserData)

    // Set greeting based on time of day
    const hour = new Date().getHours()
    let timeGreeting = ''
    if (hour < 12) timeGreeting = 'Good morning'
    else if (hour < 18) timeGreeting = 'Good afternoon'
    else timeGreeting = 'Good evening'
    
    setGreeting(`${timeGreeting}, ${parsedUserData.name}`)
  }, [router])

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recent Uploads Section */}
            <div className="col-span-2">
              <div className="bg-card rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-serif text-foreground mb-2">Recent Uploads</h2>
                <p className="text-muted-foreground mb-4">Your recently analyzed clothing items</p>
                <Tabs defaultValue="recommendations">
                  <TabsList className="mb-4 bg-muted">
                    <TabsTrigger 
                      value="recommendations" 
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Recommendations
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Favorites
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Chat History
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="recommendations" className="mt-0">
                    <div className="text-center py-12">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground text-lg">
                        No recommendations yet. Upload some items to get started!
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="favorites" className="mt-0">
                    <div className="text-center text-emerald-100/70 py-12">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-emerald-100/50" />
                      <p className="text-lg">No favorites yet. Start adding items to your favorites!</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="chat" className="mt-0">
                    <div className="text-center text-emerald-100/70 py-12">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-emerald-100/50" />
                      <p className="text-lg">No chat history yet. Start a conversation with our AI!</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Style Profile Section */}
            <div className="col-span-1">
              <StyleProfile userId={userData.userId} />
            </div>

            {/* Color Analysis Section */}
            <div className="col-span-2">
              <div className="bg-card rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-serif text-foreground mb-2">Color Analysis</h2>
                <p className="text-muted-foreground mb-4">Colors that appear most frequently in your wardrobe</p>
                <ColorAnalysis userId={userData.userId} />
              </div>
            </div>

            {/* Trending Section */}
            <div className="col-span-1">
              <div className="bg-card rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-serif text-foreground mb-2">Trending Now</h2>
                <p className="text-muted-foreground mb-4">Fashion trends that match your style</p>
                <ul className="space-y-4">
                  {trendingItems.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  Explore All Trends
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

