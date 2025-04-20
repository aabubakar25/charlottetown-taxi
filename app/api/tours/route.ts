import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    const tours = db.getTours()
    return NextResponse.json({ tours })
  } catch (error) {
    console.error("Get tours error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

