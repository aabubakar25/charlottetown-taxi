"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { handlePhoneCall } from "@/utils/phone-utils"
import AddressAutocomplete from "./address-autocomplete"

export default function BookingForm() {
  const phoneNumber = "782-377-7533"
  const [formData, setFormData] = useState({
    name: "",
    contactPhone: "",
    pickupLocation: "",
    dropoffLocation: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    passengers: "1-2",
    vehicleType: "sedan", // Default vehicle type
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Update the handleAddressSelect function to properly update the form data
  const handleAddressSelect = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const setVehicleType = (type: string) => {
    setFormData((prev) => ({ ...prev, vehicleType: type }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Format the booking details for SMS
    const bookingDetails = `
New Taxi Booking:
- Name: ${formData.name}
- Phone: ${formData.contactPhone}
- Pickup: ${formData.pickupLocation}
- Dropoff: ${formData.dropoffLocation}
- Date: ${formData.date}
- Time: ${formData.time}
- Passengers: ${formData.passengers}
- Vehicle: ${formData.vehicleType.charAt(0).toUpperCase() + formData.vehicleType.slice(1)}
- Notes: ${formData.notes || "None"}
    `.trim()

    // Encode the message for SMS
    const encodedMessage = encodeURIComponent(bookingDetails)

    // Create SMS link
    const smsLink = `sms:${phoneNumber.replace(/-/g, "")}?body=${encodedMessage}`

    // Open SMS app with pre-filled message
    window.location.href = smsLink

    // Show success message after a short delay
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        setFormData({
          name: "",
          contactPhone: "",
          pickupLocation: "",
          dropoffLocation: "",
          date: new Date().toISOString().split("T")[0],
          time: new Date().toTimeString().slice(0, 5),
          passengers: "1-2",
          vehicleType: "sedan",
          notes: "",
        })
      }, 3000)
    }, 1000)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Book Your Taxi</h2>

      {showSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 flex items-center justify-center">
              <i className="ri-check-line text-green-600"></i>
            </div>
            <p>Your booking request has been sent! We'll confirm shortly.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="ri-user-line text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="ri-phone-line text-gray-400"></i>
                  </div>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                    pattern="[0-9]{3}[-. ]?[0-9]{3}[-. ]?[0-9]{4}"
                    title="Please enter a valid phone number (e.g., 555-123-4567)"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: 555-123-4567</p>
              </div>
            </div>
          </div>

          {/* Ride Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Ride Details</h3>

            <div>
              <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <i className="ri-map-pin-line text-gray-400"></i>
                </div>

                <AddressAutocomplete
                  id="pickupLocation"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  onSelect={(value) => handleAddressSelect("pickupLocation", value)}
                  required
                  className="pl-10"
                  placeholder="Enter pickup address"
                />
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700 mb-1">
                Dropoff Location*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <i className="ri-map-pin-line text-gray-400"></i>
                </div>
                <AddressAutocomplete
                  id="dropoffLocation"
                  name="dropoffLocation"
                  value={formData.dropoffLocation}
                  onChange={handleChange}
                  onSelect={(value) => handleAddressSelect("dropoffLocation", value)}
                  required
                  className="pl-10"
                  placeholder="Enter destination address"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="ri-calendar-line text-gray-400"></i>
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="ri-time-line text-gray-400"></i>
                  </div>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Options Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Vehicle & Passengers</h3>

            {/* Vehicle Size Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Size*</label>
              <div className="grid grid-cols-3 gap-3">
                <div
                  className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${
                    formData.vehicleType === "sedan"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setVehicleType("sedan")}
                >
                  <div className="w-12 h-12 flex items-center justify-center mb-2">
                    <i className="ri-taxi-line text-2xl text-primary"></i>
                  </div>
                  <h4 className="font-medium text-sm">Sedan</h4>
                  <p className="text-xs text-gray-500 mt-1">Up to 4 people</p>
                </div>

                <div
                  className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${
                    formData.vehicleType === "suv"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setVehicleType("suv")}
                >
                  <div className="w-12 h-12 flex items-center justify-center mb-2">
                    <i className="ri-car-line text-2xl text-primary"></i>
                  </div>
                  <h4 className="font-medium text-sm">SUV</h4>
                  <p className="text-xs text-gray-500 mt-1">Up to 6 people</p>
                </div>

                <div
                  className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${
                    formData.vehicleType === "van"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setVehicleType("van")}
                >
                  <div className="w-12 h-12 flex items-center justify-center mb-2">
                    <i className="ri-bus-line text-2xl text-primary"></i>
                  </div>
                  <h4 className="font-medium text-sm">Van</h4>
                  <p className="text-xs text-gray-500 mt-1">Up to 8 people</p>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Passengers*
              </label>
              <select
                id="passengers"
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="1-2">1-2 passengers</option>
                <option value="3-4">3-4 passengers</option>
                <option value="5-6">5-6 passengers</option>
                <option value="7+">7+ passengers</option>
              </select>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Information</h3>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Any special requirements or instructions..."
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              type="button"
              onClick={() => handlePhoneCall(phoneNumber)}
              className="flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              <i className="ri-phone-line"></i>
              <span>Call Directly</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-secondary text-black py-3 px-4 rounded-md hover:bg-secondary/90 transition-colors"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <i className="ri-send-plane-line"></i>
                  <span>Book Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

