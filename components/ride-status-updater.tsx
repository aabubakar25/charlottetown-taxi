"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { updateRideStatus } from "@/app/actions/ride-actions"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function RideStatusUpdater({ ride }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusUpdate = async (newStatus) => {
    setIsLoading(true)

    try {
      await updateRideStatus(ride.id, newStatus)

      toast({
        title: "Status Updated",
        description: `Ride status has been updated to ${newStatus}.`,
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStatusActions = () => {
    switch (ride.status) {
      case "pending":
        return (
          <>
            <Button
              onClick={() => handleStatusUpdate("accepted")}
              className="bg-green-500 hover:bg-green-600"
              disabled={isLoading}
            >
              Accept Ride
            </Button>
            <Button
              onClick={() => handleStatusUpdate("cancelled")}
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-50"
              disabled={isLoading}
            >
              Cancel Ride
            </Button>
          </>
        )

      case "accepted":
        return (
          <Button
            onClick={() => handleStatusUpdate("inProgress")}
            className="bg-blue-500 hover:bg-blue-600"
            disabled={isLoading}
          >
            Start Ride
          </Button>
        )

      case "inProgress":
        return (
          <Button
            onClick={() => handleStatusUpdate("completed")}
            className="bg-green-500 hover:bg-green-600"
            disabled={isLoading}
          >
            Complete Ride
          </Button>
        )

      case "completed":
        return <div className="text-green-600 font-medium">This ride has been completed.</div>

      case "cancelled":
        return <div className="text-red-600 font-medium">This ride has been cancelled.</div>

      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ride Status</CardTitle>
        <CardDescription>Update the status of this ride</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-500">Current Status</div>
          <div className="font-medium text-lg capitalize">{ride.status}</div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">{renderStatusActions()}</CardFooter>
    </Card>
  )
}

