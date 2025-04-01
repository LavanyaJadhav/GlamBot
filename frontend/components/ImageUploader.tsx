"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "./ui/card";
import { Button } from "./ui/button";

// Define valid categories and their mappings
const VALID_CATEGORIES = {
  'tshirt': 'T-Shirt – Navy Blue',
  'hoodie': 'Hoodie – Olive Green', 
  'jeans': 'Jeans – Dark Grey',
  'formalshirt': 'Formal Shirt – Sky Blue',
  'sweater': 'Sweater – Maroon',
  'jacket': 'Jacket – Mustard Yellow',
  'shorts': 'Shorts – Beige',
  'kurta': 'Kurta – White',
  'tracksuit': 'Tracksuit – Black',
  'blazer': 'Blazer – Burgundy'
};

export default function ImageUploader() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    // Get the filename without extension
    const filename = file.name.split('.')[0].toLowerCase();
    
    // Find matching category
    const category = Object.entries(VALID_CATEGORIES).find(([key]) => 
      filename.includes(key)
    )?.[0];

    if (!category) {
      setError(`Invalid filename. Please use one of: ${Object.keys(VALID_CATEGORIES).join(', ')}`);
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Upload image
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Redirect to the category recommendations page
      router.push(`/recco/${category}`);
      
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setError(null);
            }}
            className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90"
          />
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Filename should include the category (e.g., tshirt-blue.jpg, hoodie-green.jpg)
          </p>
        </div>
        
        <Button
          onClick={handleUpload}
          className="w-full"
          disabled={!file}
        >
          Get Recommendations
        </Button>
      </div>
    </Card>
  );
} 