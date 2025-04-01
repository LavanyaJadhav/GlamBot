import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface Product {
  product_id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  style: string;
}

interface RecommendationsProps {
  userId: number;
}

export function Recommendations({ userId }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  const fetchRecommendations = async () => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:5000/api/recommendations/user/${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recommendations');
      }
      
      // Ensure data is an array
      setRecommendations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId: number) => {
    try {
      await fetch('http://localhost:5000/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
        }),
      });
      // You might want to show a success message or update the UI
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Personalized Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((product) => (
          <Card key={product.product_id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-sm text-gray-500 mt-2">Style: {product.style}</p>
              <p className="text-lg font-semibold mt-2">${product.price}</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addToFavorites(product.product_id)}
                className="w-full"
              >
                <Heart className="w-4 h-4 mr-2" />
                Add to Favorites
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {recommendations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No recommendations available yet. Try uploading some images!</p>
        </div>
      )}
    </div>
  );
} 