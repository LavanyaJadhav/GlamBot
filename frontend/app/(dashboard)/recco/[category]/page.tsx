"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"

// Define the recommendations data
const categoryRecommendations = {
  "tshirt": {
    title: "T-Shirt – Navy Blue",
    recommendations: [
      {
        type: "Same Color, Same Type",
        item: "Navy Blue Cotton T-Shirt",
        link: "https://www.amazon.in/s?k=navy+blue+cotton+tshirt"
      },
      {
        type: "Same Color, Different Type",
        item: "Navy Blue Polo T-Shirt",
        link: "https://www.amazon.in/s?k=navy+blue+polo+tshirt"
      },
      {
        type: "Different Color, Same Type",
        item: "Black Cotton T-Shirt",
        link: "https://www.amazon.in/s?k=black+cotton+tshirt"
      },
      {
        type: "Different Color, Different Type",
        item: "Grey Polo T-Shirt",
        link: "https://www.amazon.in/s?k=grey+polo+tshirt"
      }
    ]
  },
  "hoodie": {
    title: "Hoodie – Olive Green",
    recommendations: [
      {
        type: "Same Color, Same Type",
        item: "Olive Green Zip-Up Hoodie",
        link: "https://www.amazon.in/s?k=olive+green+zip+up+hoodie"
      },
      {
        type: "Same Color, Different Type",
        item: "Olive Green Pullover Hoodie",
        link: "https://www.amazon.in/s?k=olive+green+pullover+hoodie"
      },
      {
        type: "Different Color, Same Type",
        item: "Black Zip-Up Hoodie",
        link: "https://www.amazon.in/s?k=black+zip+up+hoodie"
      },
      {
        type: "Different Color, Different Type",
        item: "Grey Pullover Hoodie",
        link: "https://www.amazon.in/s?k=grey+pullover+hoodie"
      }
    ]
  },
  // Add all 10 categories here...
}

export default function CategoryRecommendations() {
  const { category } = useParams()
  const recommendations = categoryRecommendations[category as keyof typeof categoryRecommendations]

  if (!recommendations) {
    return <div>Category not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif">{recommendations.title}</h1>
          <p className="text-muted-foreground">
            Here are your personalized recommendations
          </p>
        </div>

        <div className="grid gap-6">
          {recommendations.recommendations.map((rec, index) => (
            <Card key={index} className="p-4">
              <h3 className="font-serif text-lg mb-2">{rec.type}</h3>
              <p className="text-muted-foreground mb-4">{rec.item}</p>
              <Button asChild variant="outline" className="w-full">
                <Link href={rec.link} target="_blank" rel="noopener noreferrer">
                  View on Amazon
                </Link>
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="/recco">
              Upload Another Image
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
} 