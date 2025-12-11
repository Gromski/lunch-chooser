'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthProvider'

interface Location {
  latitude: number
  longitude: number
  address?: string
}

interface LocationContextType {
  location: Location | null
  isLoading: boolean
  error: string | null
  setLocation: (location: Location | null) => void
  detectLocation: () => Promise<void>
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [location, setLocationState] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize location from user's default location or localStorage
  useEffect(() => {
    if (user?.defaultLocation) {
      setLocationState({
        latitude: user.defaultLocation.latitude,
        longitude: user.defaultLocation.longitude,
      })
    } else {
      // Try to load from localStorage
      const savedLocation = localStorage.getItem('userLocation')
      if (savedLocation) {
        try {
          setLocationState(JSON.parse(savedLocation))
        } catch {
          // Invalid saved location, ignore
        }
      }
    }
  }, [user])

  // Save location to localStorage when it changes
  useEffect(() => {
    if (location) {
      localStorage.setItem('userLocation', JSON.stringify(location))
    }
  }, [location])

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        setLocationState(newLocation)
        setIsLoading(false)
      },
      (err) => {
        setError(err.message || 'Failed to detect location')
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    )
  }

  const setLocation = (newLocation: Location | null) => {
    setLocationState(newLocation)
    setError(null)
  }

  const value: LocationContextType = {
    location,
    isLoading,
    error,
    setLocation,
    detectLocation,
  }

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}
