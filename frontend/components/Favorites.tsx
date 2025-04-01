import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Product {
  product_id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  favorited_at: string;
}

interface FavoritesProps {
  userId: number;
}

export function Favorites({ userId }: FavoritesProps) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/favorites/user/${userId}`);
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId: number) => {
    try {
      await fetch(`http://localhost:5000/api/favorites/${userId}/${productId}`, {
        method: 'DELETE',
      });
      setFavorites(favorites.filter(fav => fav.product_id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return <div>Loading favorites...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {favorites.map((product) => (
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
            <p className="text-lg font-semibold mt-2">${product.price}</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeFavorite(product.product_id)}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove from Favorites
            </Button>
          </CardFooter>
        </Card>
      ))}
      {favorites.length === 0 && (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">No favorites yet. Start adding some!</p>
        </div>
      )}
    </div>
  );
} 