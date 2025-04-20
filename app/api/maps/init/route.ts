import { NextResponse } from "next/server"

export async function GET() {
  try {
    // We're not using or exposing any API keys here
    // Just returning a URL to our proxy endpoint
    return NextResponse.json({
      success: true,
      mapUrl: "/api/maps/proxy",
    })
  } catch (error) {
    console.error("Maps init error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

