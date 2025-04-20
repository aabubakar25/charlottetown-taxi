"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Clock, Car } from "lucide-react"
import { bookRide } from "@/app/actions/ride-actions"
import { useToast } from "@/components/ui/use-toast"

export default function BookPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [bookingType, setBookingType] = useState("now")
  const [rideDetails, setRideDetails] = useState({
    pickup: "",
    destination: "",
    date: "",
    time: "",
    carType: "standard",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRideDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await bookRide({
        ...rideDetails,
        bookingType,
      })

      toast({
        title: "Ride Booked Successfully!",
        description: "A driver will be assigned to you shortly.",
      })

      router.push(`/rides/${result.rideId}`)
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Book Your Ride</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Ride Details</CardTitle>
            <CardDescription>Enter your pickup and destination details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="now" onValueChange={setBookingType}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="now">Ride Now</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickup" className="flex items-center gap-2">
                      <MapPin size={16} className="text-yellow-500" />
                      Pickup Location
                    </Label>
                    <Input
                      id="pickup"
                      name="pickup"
                      placeholder="Enter pickup address"
                      value={rideDetails.pickup}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination" className="flex items-center gap-2">
                      <MapPin size={16} className="text-yellow-500" />
                      Destination
                    </Label>
                    <Input
                      id="destination"
                      name="destination"
                      placeholder="Enter destination address"
                      value={rideDetails.destination}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {bookingType === "schedule" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="flex items-center gap-2">
                          <Calendar size={16} className="text-yellow-500" />
                          Date
                        </Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={rideDetails.date}
                          onChange={handleInputChange}
                          required={bookingType === "schedule"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time" className="flex items-center gap-2">
                          <Clock size={16} className="text-yellow-500" />
                          Time
                        </Label>
                        <Input
                          id="time"
                          name="time"
                          type="time"
                          value={rideDetails.time}
                          onChange={handleInputChange}
                          required={bookingType === "schedule"}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Car size={16} className="text-yellow-500" />
                      Vehicle Type
                    </Label>
                    <RadioGroup
                      defaultValue="standard"
                      name="carType"
                      value={rideDetails.carType}
                      onValueChange={(value) => setRideDetails((prev) => ({ ...prev, carType: value }))}
                      className="grid grid-cols-3 gap-4"
                    >
                      <div className="flex flex-col items-center space-y-2 border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="economy" id="economy" className="sr-only" />
                        <Label htmlFor="economy" className="cursor-pointer text-center">
                          <Car size={24} className="mx-auto mb-2" />
                          Economy
                          <p className="text-xs text-gray-500 mt-1">$10-15</p>
                        </Label>
                      </div>

                      <div className="flex flex-col items-center space-y-2 border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="standard" id="standard" className="sr-only" />
                        <Label htmlFor="standard" className="cursor-pointer text-center">
                          <Car size={24} className="mx-auto mb-2" />
                          Standard
                          <p className="text-xs text-gray-500 mt-1">$15-20</p>
                        </Label>
                      </div>

                      <div className="flex flex-col items-center space-y-2 border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="premium" id="premium" className="sr-only" />
                        <Label htmlFor="premium" className="cursor-pointer text-center">
                          <Car size={24} className="mx-auto mb-2" />
                          Premium
                          <p className="text-xs text-gray-500 mt-1">$25-30</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Tabs>

              <Button
                type="submit"
                className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Book Ride"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact information instead of map */}
        <div className="h-[500px] rounded-lg overflow-hidden border bg-white p-6 flex flex-col justify-center">
          <h3 className="text-xl font-semibold mb-4">Need immediate assistance?</h3>
          <p className="mb-4">Call or text us directly for the fastest service:</p>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full mr-3">
              <i className="ri-phone-line text-primary"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Call us 24/7</p>
              <button onClick={() => handlePhoneCall("782-377-7533")} className="font-medium text-primary">
                782-377-7533
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full mr-3">
              <i className="ri-message-2-line text-primary"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Text us</p>
              <a href="sms:7823777533" className="font-medium">
                782-377-7533
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

