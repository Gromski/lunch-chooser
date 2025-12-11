'use client'

import { useState } from 'react'
import { MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LocationDetector } from './LocationDetector'
import { useLocation } from '@/hooks/useLocation'
import { cn } from '@/lib/utils'

interface LocationSelectorProps {
  onLocationSelect?: (location: { latitude: number; longitude: number; address?: string }) => void
  className?: string
  showCurrentLocation?: boolean
}

export function LocationSelector({ 
  onLocationSelect, 
  className,
  showCurrentLocation = true 
}: LocationSelectorProps) {
  const { location, setLocation } = useLocation()
  const [address, setAddress] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleAddressSearch = async () => {
    if (!address.trim()) return

    setIsSearching(true)
    try {
      // Use Google Places API Geocoding to convert address to coordinates
      const response = await fetch(
        `/api/v1/restaurants/search?query=${encodeURIComponent(address)}&limit=1`
      )
      
      // For now, we'll use a simple geocoding approach
      // In a real implementation, you'd call Google Geocoding API
      // This is a placeholder - you may want to create a dedicated geocoding endpoint
      
      // For MVP, we'll just show an error that manual coordinate entry is needed
      // or implement a proper geocoding endpoint
      alert('Address geocoding will be implemented in a future update. Please use current location or enter coordinates manually.')
    } catch (error) {
      console.error('Geocoding error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleLocationDetected = (detectedLocation: { latitude: number; longitude: number }) => {
    const newLocation = {
      ...detectedLocation,
      address: address || undefined,
    }
    setLocation(newLocation)
    if (onLocationSelect) {
      onLocationSelect(newLocation)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {showCurrentLocation && (
        <LocationDetector onLocationDetected={handleLocationDetected} />
      )}

      <div className="space-y-2">
        <Label htmlFor="address">Or enter an address</Label>
        <div className="flex gap-2">
          <Input
            id="address"
            type="text"
            placeholder="123 Main St, City, State"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddressSearch()
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddressSearch}
            disabled={isSearching || !address.trim()}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Note: Address search requires geocoding API integration
        </p>
      </div>

      {location && (
        <div className="rounded-lg border p-3 bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Current location:</span>
            <span className="font-medium">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
