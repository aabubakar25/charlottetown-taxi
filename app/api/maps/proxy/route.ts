import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Use a regular environment variable instead of NEXT_PUBLIC_
    // This ensures it's only available on the server
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    // If no API key is available, return a fallback
    if (!apiKey) {
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Map Unavailable</title>
            <style>
              body, html {
                height: 100%;
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
              }
              .container {
                text-align: center;
                padding: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Map Service Unavailable</h2>
              <p>Please contact support for assistance.</p>
            </div>
          </body>
        </html>
        `,
        {
          headers: {
            "Content-Type": "text/html",
          },
        },
      )
    }

    // Create a basic HTML with the Google Maps script that can be loaded in an iframe
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Maps</title>
          <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places"></script>
          <style>
            body, html, #map {
              height: 100%;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            // Initialize the map
            function initMap() {
              const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 46.2382, lng: -63.1302 }, // Charlottetown coordinates
                zoom: 13,
              });
              
              // Add a marker
              new google.maps.Marker({
                position: { lat: 46.2382, lng: -63.1302 },
                map: map,
                title: "Charlottetown",
              });
              
              // Communicate with parent window
              window.addEventListener('message', function(event) {
                // Handle messages from parent window
                if (event.data.type === 'setCenter') {
                  map.setCenter(event.data.position);
                }
              });
            }
            
            // Call initMap when the page loads
            window.onload = initMap;
          </script>
        </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Maps proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

