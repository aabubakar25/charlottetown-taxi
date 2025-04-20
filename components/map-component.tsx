"use client"

import { useEffect, useRef, useState } from "react"

export default function MapComponent() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const initMap = async () => {
      try {
        // Fetch the map initialization data from our API route
        const response = await fetch("/api/maps/init")
        const data = await response.json()

        if (!data.success || !data.mapUrl) {
          console.error("Failed to get map initialization data")
          setHasError(true)
          return
        }

        // The iframe is already set up to load our proxy URL
        setIsLoading(false)
      } catch (error) {
        console.error("Error initializing map:", error)
        setHasError(true)
      }
    }

    initMap()
  }, [])

  // Function to send messages to the iframe
  const sendMessageToMap = (message: any) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, "*")
    }
  }

  if (hasError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg p-4 text-center">
        <div>
          <div className="text-4xl mb-4">📍</div>
          <h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
          <p className="text-sm text-gray-600">We're unable to load the map at this time. Please try again later.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div style={{ height: "100%", width: "100%" }} className="rounded-lg overflow-hidden">
      <iframe
        ref={iframeRef}
        src="/api/maps/proxy"
        style={{ border: "none", width: "100%", height: "100%" }}
        title="Google Map"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  )
}

