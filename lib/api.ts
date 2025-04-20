// API utility functions for the frontend

// Base URL for API requests
const API_BASE_URL = "/api"

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong")
  }

  return data as T
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, phone: string, password: string) =>
    fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, phone, password }),
    }),
}

// Bookings API
export const bookingsAPI = {
  getBookings: (userId?: string) => fetchAPI(`/bookings${userId ? `?userId=${userId}` : ""}`),

  getBooking: (id: string) => fetchAPI(`/bookings/${id}`),

  createBooking: (bookingData: any) =>
    fetchAPI("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),

  updateBookingStatus: (id: string, status: string) =>
    fetchAPI(`/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
}

// Locations API
export const locationsAPI = {
  getLocations: () => fetchAPI("/locations"),

  searchLocations: (query: string) => fetchAPI(`/locations?query=${encodeURIComponent(query)}`),
}

// Tours API
export const toursAPI = {
  getTours: () => fetchAPI("/tours"),

  getTour: (id: string) => fetchAPI(`/tours/${id}`),

  getTourBookings: (userId?: string) => fetchAPI(`/tours/bookings${userId ? `?userId=${userId}` : ""}`),

  createTourBooking: (bookingData: any) =>
    fetchAPI("/tours/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),
}

