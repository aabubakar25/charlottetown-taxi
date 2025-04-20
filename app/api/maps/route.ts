import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const origin = searchParams.get("origin")
  const destination = searchParams.get("destination")

  // Use the server-side API key (not exposed to client)
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Maps API key not configured" }, { status: 500 })
  }

  if (!origin || !destination) {
    return NextResponse.json({ error: "Origin and destination are required" }, { status: 400 })
  }

  // Create an HTML page with the embedded map
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Route Map</title>
        <style>
          html, body, #map {
            height: 100%;
            margin: 0;
            padding: 0;
          }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places"></script>
        <script>
          function initMap() {
            const map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: 46.2382, lng: -63.1311 }, // Charlottetown coordinates
              zoom: 12,
              mapTypeControl: false,
              fullscreenControl: false,
              streetViewControl: false,
            });
            
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({
              map: map,
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#1a237e",
                strokeWeight: 5,
              },
            });
            
            // Calculate route
            directionsService.route({
              origin: "${origin.replace(/"/g, '\\"')}",
              destination: "${destination.replace(/"/g, '\\"')}",
              travelMode: google.maps.TravelMode.DRIVING,
            })
            .then((response) => {
              directionsRenderer.setDirections(response);
              
              // Send message to parent window with route details
              if (window.parent) {
                const route = response.routes[0];
                const leg = route.legs[0];
                window.parent.postMessage({
                  type: 'ROUTE_DETAILS',
                  distance: leg.distance.text,
                  duration: leg.duration.text,
                  status: 'success'
                }, '*');
              }
            })
            .catch((e) => {
              console.error("Directions request failed:", e);
              if (window.parent) {
                window.parent.postMessage({
                  type: 'ROUTE_DETAILS',
                  status: 'error',
                  message: 'Could not calculate route'
                }, '*');
              }
            });
          }
          
          window.onload = initMap;
        </script>
      </head>
      <body>
        <div id="map"></div>
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}

