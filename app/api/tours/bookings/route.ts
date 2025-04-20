import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    let bookings
    if (userId) {
      bookings = db.getUserTourBookings(userId)
    } else {
      bookings = db.getTourBookings()
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Get tour bookings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tourId, userId, date, people, pickupLocation, specialRequests } = await request.json()

    // Validate input
    if (!tourId || !userId || !date || !people || !pickupLocation) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Check if tour exists
    const tour = db.getTourById(tourId)
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 })
    }

    // Create tour booking
    const newBooking = db.createTourBooking({
      tourId,
      userId,
      date,
      people,
      pickupLocation,
      specialRequests,
      status: "confirmed",
    })

    return NextResponse.json(
      {
        booking: newBooking,
        tour,
        message: "Tour booking confirmed",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create tour booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

