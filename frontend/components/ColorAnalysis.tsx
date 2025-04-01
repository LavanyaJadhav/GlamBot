'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ColorPalette {
  color_1: string;
  color_1_percentage: number;
  color_2: string;
  color_2_percentage: number;
  color_3: string;
  color_3_percentage: number;
  color_4: string;
  color_4_percentage: number;
}

// Function to convert hex to color name
const getColorName = (hex: string): string => {
  const colorMap: { [key: string]: string } = {
    '#0000FF': 'Blue',
    '#FFD700': 'Gold',
    '#FF69B4': 'Pink',
    '#32CD32': 'Green',
    '#FF0000': 'Red',
    '#00FF00': 'Lime',
    '#FFFF00': 'Yellow',
    '#FF00FF': 'Magenta',
    '#00FFFF': 'Cyan',
    '#800000': 'Maroon',
    '#008000': 'Green',
    '#000080': 'Navy',
    '#808000': 'Olive',
    '#800080': 'Purple',
    '#008080': 'Teal',
    '#C0C0C0': 'Silver',
    '#808080': 'Gray',
    '#FFFFFF': 'White',
    '#000000': 'Black'
  };

  return colorMap[hex.toUpperCase()] || hex;
};

export function ColorAnalysis({ userId }: { userId: string }) {
  const [colorPalette, setColorPalette] = useState<ColorPalette | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColorPalette = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await fetch(`http://localhost:5000/api/users/${userId}/colors`);
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch color palette');
        }

        const data = await response.json();
        setColorPalette(data);
      } catch (err) {
        console.error('Error fetching color palette:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch color palette');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchColorPalette();
    }
  }, [userId]);

  if (loading) return <div className="text-center p-4">Loading color analysis...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  if (!colorPalette) return <div className="text-center p-4">No color palette found</div>;

  // Create an array of colors with their percentages and sort by percentage
  const colors = [
    { color: colorPalette.color_1, percentage: colorPalette.color_1_percentage },
    { color: colorPalette.color_2, percentage: colorPalette.color_2_percentage },
    { color: colorPalette.color_3, percentage: colorPalette.color_3_percentage },
    { color: colorPalette.color_4, percentage: colorPalette.color_4_percentage }
  ].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-semibold mb-2">Color Analysis</h2>
        <p className="text-muted-foreground">Colors that appear most frequently in your wardrobe</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Your Color Palette</h3>
        <div className="space-y-4">
          {colors.map((colorData, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div
                className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-inner"
                style={{ backgroundColor: colorData.color }}
              />
              <div className="flex-1">
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${colorData.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full rounded-full transition-all duration-500"
                    style={{ backgroundColor: colorData.color }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-sm font-medium">{getColorName(colorData.color)}</span>
                  <span className="text-sm text-muted-foreground">{colorData.percentage}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 