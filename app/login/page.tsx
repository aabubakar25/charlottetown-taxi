"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page since we're not implementing auth
    router.push("/")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Redirecting...</h1>
        <p className="text-gray-600">Login functionality is not available in this simplified version.</p>
      </div>
    </div>
  )
}

