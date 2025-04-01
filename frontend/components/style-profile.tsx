"use client"

import { useEffect, useState } from 'react'

// Use the style service URL
const STYLE_SERVICE_URL = process.env.NEXT_PUBLIC_STYLE_SERVICE_URL || 'http://localhost:5001';

type StylePreference = {
  style_name: string
  percentage: number
}

interface StyleProfileProps {
  userId: string
}

export function StyleProfile({ userId }: StyleProfileProps) {
  const [preferences, setPreferences] = useState<StylePreference[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString())

  useEffect(() => {
    async function loadStyleProfile() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching style profile for user:', userId);
        const response = await fetch(`${STYLE_SERVICE_URL}/api/users/${userId}/styles?t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch style profile');
        }

        const data = await response.json();
        console.log('Received style profile:', data);
        setPreferences(data);
      } catch (error) {
        console.error('Error loading style profile:', error);
        setError('Failed to load style profile');
        
        // Only use fallback data if there's an error
        const fallbackProfiles: Record<string, StylePreference[]> = {
          "1": [
            { style_name: "Casual", percentage: 40 },
            { style_name: "Contemporary", percentage: 30 },
            { style_name: "Minimalist", percentage: 20 },
            { style_name: "Streetwear", percentage: 10 }
          ],
          "default": [
            { style_name: "Casual", percentage: 35 },
            { style_name: "Minimalist", percentage: 25 },
            { style_name: "Classic", percentage: 25 },
            { style_name: "Trendy", percentage: 15 }
          ]
        };
        
        // Use fallback data
        const fallbackData = fallbackProfiles[userId] || fallbackProfiles["default"];
        setPreferences(fallbackData);
      } finally {
        setLoading(false);
      }
    }

    loadStyleProfile();
  }, [userId, lastUpdated]);

  // Function to test updating a style
  const updateStyle = async (styleName: string, newPercentage: number) => {
    try {
      const response = await fetch(
        `${STYLE_SERVICE_URL}/api/test/update/${userId}/${styleName}/${newPercentage}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to update style');
      }
      
      // Refresh the data
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error('Error updating style:', error);
      alert('Failed to update style');
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-card p-6 shadow-md border border-border/40 animate-pulse">
        <div className="h-7 w-32 bg-muted rounded mb-2"></div>
        <div className="h-4 w-48 bg-muted rounded mb-8"></div>
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 bg-muted rounded"></div>
                <div className="h-4 w-12 bg-muted rounded"></div>
              </div>
              <div className="h-2.5 bg-muted rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    console.warn('Using fallback data due to error:', error);
  }

  return (
    <div className="rounded-lg bg-card p-6 shadow-md border border-border/40">
      <h2 className="text-2xl font-serif text-foreground mb-2">Style Profile</h2>
      <p className="text-sm text-muted-foreground/80 mb-8">
        Your personalized fashion preferences
      </p>
      <div className="space-y-6">
        {preferences.map((pref) => (
          <div key={pref.style_name} className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground/90 font-medium tracking-wide">
                {pref.style_name}
              </span>
              <span 
                className="text-muted-foreground/70 tabular-nums cursor-pointer hover:text-primary"
                onClick={() => updateStyle(pref.style_name, pref.percentage < 100 ? pref.percentage + 5 : 100)}
                title="Click to increase by 5%"
              >
                {pref.percentage}%
              </span>
            </div>
            <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/80 transition-all duration-700 ease-in-out"
                style={{ width: `${pref.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-muted-foreground">
        Last updated: {new Date(lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  )
} 