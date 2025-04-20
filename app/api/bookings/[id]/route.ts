import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const booking = db.getBookingById(params.id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // If booking has a driver, get driver info
    let driver
    if (booking.driverId) {
      driver = db.getDriverById(booking.driverId)
    }

    return NextResponse.json({ booking, driver })
  } catch (error) {
    console.error("Get booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

