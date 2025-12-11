'use client'

import { LocationSelector } from '@/components/location/LocationSelector'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Lunch Chooser</h1>
          <p className="text-lg text-muted-foreground">
            Help your team decide where to eat lunch today
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Set Your Location</CardTitle>
            <CardDescription>
              Choose your location to find nearby restaurants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LocationSelector />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Browse Restaurants</CardTitle>
              <CardDescription>
                Discover restaurants near you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/restaurants">View Restaurants</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Lunch Group</CardTitle>
              <CardDescription>
                Start a new lunch group for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/groups/new">Create Group</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}



