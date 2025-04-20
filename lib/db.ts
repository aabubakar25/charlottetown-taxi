import type { Driver, Booking, Location } from "./types"

// In-memory database simulation
class Database {
  private drivers: Driver[] = [
    {
      id: "1",
      name: "Michael Davis",
      phone: "782-555-9876",
      vehicle: "Toyota Camry",
      plate: "PEI 123",
      rating: 4.9,
      available: true,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      phone: "782-555-8765",
      vehicle: "Honda Accord",
      plate: "PEI 456",
      rating: 4.8,
      available: true,
    },
    {
      id: "3",
      name: "David Wilson",
      phone: "782-555-7654",
      vehicle: "Ford Escape",
      plate: "PEI 789",
      rating: 4.7,
      available: true,
    },
  ]

  private bookings: Booking[] = []

  private locations: Location[] = [
    { name: "Charlottetown Airport", coordinates: { lat: 46.2903, lng: -63.1261 } },
    { name: "University of Prince Edward Island", coordinates: { lat: 46.2557, lng: -63.1478 } },
    { name: "Queen Elizabeth Hospital", coordinates: { lat: 46.2483, lng: -63.1294 } },
    { name: "Downtown Charlottetown", coordinates: { lat: 46.2338, lng: -63.1264 } },
    { name: "Confederation Centre of the Arts", coordinates: { lat: 46.2337, lng: -63.1269 } },
    { name: "Victoria Park", coordinates: { lat: 46.2271, lng: -63.1361 } },
    { name: "Charlottetown Mall", coordinates: { lat: 46.2461, lng: -63.1392 } },
    { name: "Holland College", coordinates: { lat: 46.2341, lng: -63.1252 } },
  ]

  // Driver methods
  public getDrivers(): Driver[] {
    return this.drivers
  }

  public getDriverById(id: string): Driver | undefined {
    return this.drivers.find((driver) => driver.id === id)
  }

  public getAvailableDrivers(): Driver[] {
    return this.drivers.filter((driver) => driver.available)
  }

  public updateDriverAvailability(id: string, available: boolean): Driver | undefined {
    const driver = this.drivers.find((driver) => driver.id === id)
    if (driver) {
      driver.available = available
    }
    return driver
  }

  // Booking methods
  public getBookings(): Booking[] {
    return this.bookings
  }

  public getBookingById(id: string): Booking | undefined {
    return this.bookings.find((booking) => booking.id === id)
  }

  public createBooking(booking: Omit<Booking, "id" | "createdAt">): Booking {
    const newBooking: Booking = {
      id: Date.now().toString(),
      ...booking,
      createdAt: new Date().toISOString(),
    }
    this.bookings.push(newBooking)
    return newBooking
  }

  public updateBookingStatus(id: string, status: Booking["status"], driverId?: string): Booking | undefined {
    const booking = this.bookings.find((booking) => booking.id === id)
    if (booking) {
      booking.status = status
      if (driverId) {
        booking.driverId = driverId
      }
    }
    return booking
  }

  // Location methods
  public getLocations(): Location[] {
    return this.locations
  }

  public searchLocations(query: string): Location[] {
    return this.locations.filter((location) => location.name.toLowerCase().includes(query.toLowerCase()))
  }

  public getLocationByName(name: string): Location | undefined {
    return this.locations.find((location) => location.name === name)
  }
}

// Create a singleton instance
const db = new Database()

export default db

