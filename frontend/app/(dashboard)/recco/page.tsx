"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Grid3X3, List, Shirt, TrendingUp, Palette, Heart, MessageSquare } from "lucide-react"
import ImageUploader from "@/components/ImageUploader"

export default function ReccoPage() {
  return (
    <div className="container mx-auto p-4">
      <Card className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif">Style Recommendations</h1>
          <p className="text-muted-foreground">
            Upload an image to get personalized recommendations
          </p>
        </div>

        <Tabs defaultValue="recommendations">
          <TabsList className="mb-4">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="chat">Chat History</TabsTrigger>
          </TabsList>
          <TabsContent value="recommendations" className="mt-0">
            <ImageUploader />
          </TabsContent>
          <TabsContent value="favorites" className="mt-0">
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">
                No favorites yet. Start adding items you love!
              </p>
            </div>
          </TabsContent>
          <TabsContent value="chat" className="mt-0">
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">
                No chat history yet. Start a conversation with our AI!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
} 