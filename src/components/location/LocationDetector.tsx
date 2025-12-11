'use client'

import { useEffect } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocation } from '@/hooks/useLocation'
import { cn } from '@/lib/utils'

interface LocationDetectorProps {
  onLocationDetected?: (location: { latitude: number; longitude: number }) => void
  className?: string
}

export function LocationDetector({ 
  onLocationDetected, 
  className 
}: LocationDetectorProps) {
  const { location, isLoading, error, detectLocation } = useLocation()

  useEffect(() => {
    if (location && onLocationDetected) {
      onLocationDetected({
        latitude: location.latitude,
        longitude: location.longitude,
      })
    }
  }, [location, onLocationDetected])

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Button
        type="button"
        variant="outline"
        onClick={detectLocation}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Detecting...
          </>
        ) : (
          <>
            <MapPin className="mr-2 h-4 w-4" />
            Use Current Location
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {location && !error && (
        <p className="text-sm text-muted-foreground">
          Location detected: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </p>
      )}
    </div>
  )
}
