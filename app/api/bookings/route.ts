import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    const bookings = db.getBookings()
    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Get bookings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      pickupLocation,
      pickupCoordinates,
      destination,
      destinationCoordinates,
      date,
      time,
      vehicleType,
      passengers,
      notes,
    } = body

    // Validate input
    if (!pickupLocation || !destination || !date || !time) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Create booking
    const newBooking = db.createBooking({
      pickupLocation,
      pickupCoordinates,
      destination,
      destinationCoordinates,
      date,
      time,
      vehicleType: vehicleType || "Sedan",
      passengers: passengers || "1-2",
      notes,
      status: "pending",
    })

    // Find available driver
    const availableDrivers = db.getAvailableDrivers()

    if (availableDrivers.length > 0) {
      // Randomly select a driver (in a real app, would use proximity, etc.)
      const randomIndex = Math.floor(Math.random() * availableDrivers.length)
      const selectedDriver = availableDrivers[randomIndex]

      // Update booking with driver info
      const updatedBooking = db.updateBookingStatus(newBooking.id, "confirmed", selectedDriver.id)

      // Generate random arrival time between 3-15 minutes
      const estimatedArrival = Math.floor(Math.random() * 12) + 3
      if (updatedBooking) {
        updatedBooking.estimatedArrival = estimatedArrival
      }

      // Update driver availability
      db.updateDriverAvailability(selectedDriver.id, false)

      return NextResponse.json(
        {
          booking: updatedBooking,
          driver: selectedDriver,
          message: "Booking confirmed",
        },
        { status: 201 },
      )
    } else {
      // No available drivers
      const updatedBooking = db.updateBookingStatus(newBooking.id, "cancelled")

      return NextResponse.json(
        {
          booking: updatedBooking,
          message: "No drivers available",
        },
        { status: 201 },
      )
    }
  } catch (error) {
    console.error("Create booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

