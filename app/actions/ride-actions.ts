"use server"

import { revalidatePath } from "next/cache"

// In a real app, this would connect to a database
const rides = new Map()

export async function bookRide(rideDetails) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate a unique ID for the ride
  const rideId = `ride_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  // Create a new ride object
  const ride = {
    id: rideId,
    status: "pending",
    createdAt: new Date().toISOString(),
    ...rideDetails,
    // In a real app, you would calculate these values
    estimatedPrice: calculatePrice(rideDetails.carType),
    estimatedDuration: "15 mins",
    estimatedDistance: "3.2 miles",
  }

  // Store the ride in our "database"
  rides.set(rideId, ride)

  // Revalidate the rides page
  revalidatePath("/rides")

  return { rideId, success: true }
}

export async function getRide(rideId) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Get the ride from our "database"
  const ride = rides.get(rideId)

  if (!ride) {
    throw new Error("Ride not found")
  }

  return ride
}

export async function getAllRides() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Convert the Map to an array of rides
  return Array.from(rides.values())
}

export async function updateRideStatus(rideId, status) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Get the ride from our "database"
  const ride = rides.get(rideId)

  if (!ride) {
    throw new Error("Ride not found")
  }

  // Update the ride status
  ride.status = status

  // If the status is 'completed', add a driver rating option
  if (status === "completed") {
    ride.completedAt = new Date().toISOString()
  }

  // If the status is 'accepted', assign a driver
  if (status === "accepted") {
    ride.driver = {
      id: `driver_${Math.random().toString(36).substring(2, 9)}`,
      name: "John Driver",
      rating: 4.8,
      car: {
        model: "Toyota Camry",
        color: "Black",
        licensePlate: "ABC 123",
      },
    }
  }

  // Revalidate the rides page
  revalidatePath(`/rides/${rideId}`)

  return { success: true }
}

function calculatePrice(carType) {
  const basePrice = 10

  switch (carType) {
    case "economy":
      return basePrice
    case "standard":
      return basePrice * 1.5
    case "premium":
      return basePrice * 2.5
    default:
      return basePrice
  }
}

