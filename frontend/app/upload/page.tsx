"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Camera, ImageIcon, X, Crop, RotateCw, Sparkles } from "lucide-react"

// Define valid categories
const VALID_CATEGORIES = [
  'tshirt',
  'hoodie',
  'jeans',
  'formalshirt',
  'sweater',
  'jacket',
  'shorts',
  'kurta',
  'tracksuit',
  'blazer'
];

export default function UploadPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upload")
  const [dragActive, setDragActive] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    try {
      setError(null);
      setIsAnalyzing(true);
      setProgress(0);
      
      // Get category from filename
      const filename = file.name.toLowerCase().split('.')[0];
      
      // Map filename to category page
      const categoryMap: { [key: string]: string } = {
        'tshirt': 't-shirt',
        'hoodie': 'hoodie',
        'jeans': 'jeans',
        'formalshirt': 'formal-shirt',
        'sweater': 'sweater',
        'jacket': 'jacket',
        'shorts': 'shorts',
        'kurta': 'kurta',
        'tracksuit': 'tracksuit',
        'blazer': 'blazer'
      };

      const category = Object.keys(categoryMap).find(cat => filename.includes(cat));
      
      if (!category) {
        setError(`Invalid filename. Please use one of these: ${Object.keys(categoryMap).join(', ')}`);
        setIsAnalyzing(false);
        return;
      }

      // Simulate processing
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 500);

      try {
        // Simulate file processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setProgress(100);

        // Redirect to the appropriate recommendation page
        setTimeout(() => {
          router.push(`/recommendations/${categoryMap[category]}`);
        }, 1000);

      } catch (err) {
        console.error('Processing error:', err);
        setError('Failed to process image. Please try again.');
      } finally {
        clearInterval(progressInterval);
      }

    } catch (err) {
      console.error('Error:', err);
      setError('Failed to process image');
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Tabs defaultValue="upload" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="camera">Take Photo</TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <Card>
                  <CardContent className="p-6">
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
                        dragActive ? "border-primary" : "border-muted"
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragActive(true)
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleDrop}
                    >
                      {isAnalyzing ? (
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                          </div>
                          <p className="text-lg font-medium">Analyzing your image...</p>
                          <Progress value={progress} />
                        </div>
                      ) : (
                        <>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                          />
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-lg font-medium">
                                Drop your image here, or{" "}
                                <button
                                  onClick={() => fileInputRef.current?.click()}
                                  className="text-primary hover:underline"
                                >
                                  browse
                                </button>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Filename should include category (e.g., tshirt-blue.jpg or blue-tshirt.jpg)
                              </p>
                              {error && (
                                <p className="text-sm text-destructive">{error}</p>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="camera">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                      <div className="space-y-2">
                        <h3 className="font-playfair font-bold text-lg">Take a photo with your camera</h3>
                        <p className="text-muted-foreground text-sm">
                          Position your clothing item in good lighting for best results
                        </p>
                      </div>
                      <Button className="bg-primary hover:bg-primary/90">
                        <Camera className="mr-2 h-4 w-4" /> Open Camera
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

