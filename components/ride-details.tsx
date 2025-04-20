"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Car, DollarSign, User } from "lucide-react"
import GoogleMapRoute from "@/components/google-map-route"

export default function RideDetails({ ride }) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    inProgress: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Ride #{ride.id.substring(0, 8)}</CardTitle>
            <Badge className={statusColors[ride.status]}>
              {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
            </Badge>
          </div>
          <CardDescription>{new Date(ride.createdAt).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  <span>Pickup Location</span>
                </div>
                <div className="font-medium">{ride.pickup}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  <span>Destination</span>
                </div>
                <div className="font-medium">{ride.destination}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Car size={16} />
                  <span>Vehicle Type</span>
                </div>
                <div className="font-medium capitalize">{ride.carType}</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <DollarSign size={16} />
                  <span>Estimated Price</span>
                </div>
                <div className="font-medium">${ride.estimatedPrice}</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>Est. Duration</span>
                </div>
                <div className="font-medium">{ride.estimatedDuration}</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  <span>Est. Distance</span>
                </div>
                <div className="font-medium">{ride.estimatedDistance}</div>
              </div>
            </div>

            {ride.driver && (
              <div className="pt-4 mt-4 border-t">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User size={16} />
                  Driver Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-medium">{ride.driver.name}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Vehicle</div>
                    <div className="font-medium">
                      {ride.driver.car.color} {ride.driver.car.model}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">License Plate</div>
                    <div className="font-medium">{ride.driver.car.licensePlate}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Google Maps Route */}
      <GoogleMapRoute pickupLocation={ride.pickup} dropoffLocation={ride.destination} className="mt-6 h-[300px]" />

      {/* Contact Information Card - keep this part */}
      <div className="pt-4 mt-4 bg-white rounded-lg overflow-hidden border p-6 flex flex-col justify-center items-center">
        <div className="text-center">
          <i className="ri-taxi-line text-5xl text-primary mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Need to modify your ride?</h3>
          <p className="text-gray-600 mb-4">Call or text us directly for immediate assistance</p>
          <button
            onClick={() => (window.location.href = "tel:7823777533")}
            className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-colors"
          >
            Call 782-377-7533
          </button>
        </div>
      </div>
    </div>
  )
}

