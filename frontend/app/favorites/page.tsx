"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Trash2, Share2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from 'next/navigation'

interface UserData {
  userId: number;
  username: string;
  name: string;
}

export default function Favorites() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [favorites, setFavorites] = useState<any[]>([])

  useEffect(() => {
    const userDataString = localStorage.getItem('userData')
    if (!userDataString) {
      console.error('No user data found')
      router.push('/login')
      return
    }

    const parsedUserData: UserData = JSON.parse(userDataString)
    setUserData(parsedUserData)

    // TODO: Fetch favorites from backend
    // For now, using dummy data
    setFavorites([
      {
        id: 1,
        name: "Classic White Sneakers",
        image: "/images/sneakers.jpg",
        category: "Footwear",
        dateAdded: "2024-03-15"
      },
      {
        id: 2,
        name: "Denim Jacket",
        image: "/images/jacket.jpg",
        category: "Outerwear",
        dateAdded: "2024-03-14"
      },
      {
        id: 3,
        name: "Black Leather Bag",
        image: "/images/bag.jpg",
        category: "Accessories",
        dateAdded: "2024-03-13"
      }
    ])
  }, [router])

  if (!userData) {
    return <div>Loading...</div>
  }

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
            <h1 className="text-3xl md:text-4xl font-playfair font-bold">
              My Favorites
            </h1>
            <p className="text-muted-foreground mt-2">
              Your saved fashion items and outfits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-playfair">{item.name}</CardTitle>
                    <CardDescription>{item.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Added on {new Date(item.dateAdded).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {favorites.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">No favorites yet</h3>
              <p className="text-muted-foreground mt-2">
                Start adding items to your favorites to see them here
              </p>
              <Button className="mt-4" onClick={() => router.push('/dashboard')}>
                Browse Items
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
} 