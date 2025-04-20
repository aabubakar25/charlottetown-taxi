"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { updateRideStatus } from "@/app/actions/ride-actions"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function AvailableRidesTable({ rides }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loadingRideId, setLoadingRideId] = useState(null)

  const handleAcceptRide = async (rideId) => {
    setLoadingRideId(rideId)

    try {
      await updateRideStatus(rideId, "accepted")

      toast({
        title: "Ride Accepted",
        description: "You have successfully accepted this ride.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingRideId(null)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pickup</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rides.length > 0 ? (
            rides.map((ride) => (
              <TableRow key={ride.id}>
                <TableCell>{ride.pickup}</TableCell>
                <TableCell>{ride.destination}</TableCell>
                <TableCell>{new Date(ride.createdAt).toLocaleTimeString()}</TableCell>
                <TableCell>${ride.estimatedPrice}</TableCell>
                <TableCell>{ride.estimatedDistance}</TableCell>
                <TableCell className="text-right">
                  {ride.status === "pending" ? (
                    <Button
                      onClick={() => handleAcceptRide(ride.id)}
                      disabled={loadingRideId === ride.id}
                      className="bg-green-500 hover:bg-green-600"
                      size="sm"
                    >
                      {loadingRideId === ride.id ? "Accepting..." : "Accept"}
                    </Button>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No rides available at the moment.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

