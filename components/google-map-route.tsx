"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, MapPin } from "lucide-react"

interface GoogleMapRouteProps {
  pickupLocation: string
  dropoffLocation: string
  className?: string
}

export default function GoogleMapRoute({ pickupLocation, dropoffLocation, className = "" }: GoogleMapRouteProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [routeDetails, setRouteDetails] = useState<{
    distance?: string
    duration?: string
  }>({})

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "ROUTE_DETAILS") {
        if (event.data.status === "success") {
          setRouteDetails({
            distance: event.data.distance,
            duration: event.data.duration,
          })
        } else if (event.data.status === "error") {
          setError(event.data.message || "Failed to load route")
        }
        setIsLoading(false)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  // Handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setError("Failed to load map")
    setIsLoading(false)
  }

  // Open in Google Maps
  const openInGoogleMaps = () => {
    if (!pickupLocation || !dropoffLocation) return

    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      pickupLocation,
    )}&destination=${encodeURIComponent(dropoffLocation)}&travelmode=driving`

    window.open(url, "_blank")
  }

  // Construct the iframe URL
  const getMapUrl = () => {
    if (!pickupLocation || !dropoffLocation) return ""

    return `/api/maps?origin=${encodeURIComponent(pickupLocation)}&destination=${encodeURIComponent(dropoffLocation)}`
  }

  if (!pickupLocation || !dropoffLocation) {
    return (
      <Card className={`p-4 flex flex-col items-center justify-center text-center ${className}`}>
        <MapPin className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-gray-600 mb-2">Pickup and destination locations are required to display the route</p>
      </Card>
    )
  }

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <MapPin className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-600 mb-4">{error}</p>
          <Button variant="outline" onClick={openInGoogleMaps}>
            Open in Google Maps
          </Button>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src={getMapUrl()}
          className="w-full h-full min-h-[300px] border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title="Route Map"
          allow="geolocation"
        />
      )}

      <div className="absolute bottom-4 right-4 flex gap-2">
        {routeDetails.distance && routeDetails.duration && (
          <div className="bg-white/90 text-sm px-3 py-1 rounded-md shadow">
            <span className="font-medium">{routeDetails.distance}</span>
            <span className="mx-1">•</span>
            <span>{routeDetails.duration}</span>
          </div>
        )}
        <Button size="sm" variant="secondary" onClick={openInGoogleMaps}>
          Open in Google Maps
        </Button>
      </div>
    </Card>
  )
}

