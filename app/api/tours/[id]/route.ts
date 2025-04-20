import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tour = db.getTourById(params.id)

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 })
    }

    return NextResponse.json({ tour })
  } catch (error) {
    console.error("Get tour error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

