"use client"

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

interface Recommendation {
  [key: string]: {
    item: string;
    link: string;
  };
}

export default function RecommendationDisplay({ 
  imageUrl, 
  clothingType,
  color 
}: {
  imageUrl: string;
  clothingType: string;
  color: string;
}) {
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clothingType, color }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error === 'Invalid category-color combination') {
            console.error('Invalid combination. Valid options:', data.validCategories);
            // Show user-friendly error message
            return;
          }
          throw new Error(data.error || 'Failed to fetch recommendations');
        }

        setRecommendations(data.recommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [clothingType, color]);

  if (loading) return <div>Loading recommendations...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Uploaded Image */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif">Your Uploaded Item</h2>
          <img 
            src={imageUrl} 
            alt="Uploaded clothing item"
            className="rounded-lg shadow-md w-full h-96 object-cover"
          />
        </div>

        {/* Recommendations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif">Recommended Items</h2>
          {recommendations ? (
            Object.entries(recommendations).map(([type, rec]) => (
              <div key={type} className="p-4 bg-card rounded-lg shadow-md">
                <h3 className="font-serif text-lg mb-2">{type}</h3>
                <p className="text-muted-foreground mb-2">{rec.item}</p>
                <Button asChild variant="outline" className="w-full">
                  <a 
                    href={rec.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-foreground"
                  >
                    View on Amazon
                  </a>
                </Button>
              </div>
            ))
          ) : (
            <p className="text-destructive">No recommendations found for this item</p>
          )}
        </div>
      </div>
    </div>
  );
} 