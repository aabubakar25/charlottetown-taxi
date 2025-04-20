// Driver types
export interface Driver {
  id: string
  name: string
  phone: string
  vehicle: string
  plate: string
  rating: number
  available: boolean
}

// Booking types
export interface Booking {
  id: string
  pickupLocation: string
  pickupCoordinates?: {
    lat: number
    lng: number
  }
  destination: string
  destinationCoordinates?: {
    lat: number
    lng: number
  }
  date: string
  time: string
  vehicleType: string
  passengers: string
  notes?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  driverId?: string
  estimatedArrival?: number
  createdAt: string
}

// Location types
export interface Location {
  name: string
  coordinates: {
    lat: number
    lng: number
  }
}

// User types
export interface User {
  id: string
  name: string
  email: string
  phone: string
  password?: string
  role?: string
}

