"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { handlePhoneCall } from "@/utils/phone-utils"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { CustomCalendar } from "@/components/ui/custom-calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import AddressAutocompleteV2 from "./address-autocomplete-v2"

interface ServiceDetailProps {
  service: {
    title: string
    description: string
    imageSrc: string
    longDescription?: string
  }
  onClose: () => void
  phoneNumber: string
}

export default function ServiceDetailV2({ service, onClose, phoneNumber }: ServiceDetailProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pickupLocation: "",
    dropoffLocation: "",
    date: new Date(),
    time: "",
    vehicleSize: "",
    additionalInfo: "",
  })
  const [isAirportService, setIsAirportService] = useState(service.title === "Airport Transfers")
  const [isTourService, setIsTourService] = useState(service.title === "City Tours")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Format the booking details for SMS
    let bookingDetails = `
${service.title} Booking Request:
- Name: ${formData.name}
- Phone: ${formData.phone}
`

    if (isAirportService) {
      bookingDetails += `
- Pickup: ${formData.pickupLocation}
- Dropoff: ${formData.dropoffLocation}
- Date: ${format(formData.date, "MMM dd, yyyy")}
- Time: ${formData.time}
- Vehicle: ${formData.vehicleSize}
`
    }

    if (isTourService) {
      bookingDetails += `
- Date: ${format(formData.date, "MMM dd, yyyy")}
- Time: ${formData.time}
- Additional Info: ${formData.additionalInfo || "None"}
`
    }

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
        onClose()
      }, 3000)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-700 z-10"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
          <div className="h-48 md:h-64 overflow-hidden">
            <img
              src={service.imageSrc || "/placeholder.svg"}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
          <p className="text-gray-600 mb-6">{service.longDescription || service.description}</p>

          {isTourService && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center">
              <div className="mr-4 flex-shrink-0">
                <img src="/images/aquila-logo.png" alt="AQUILA Certification" className="h-15 w-15" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">Licensed Tour Operator</h3>
                <p className="text-sm text-blue-700">
                  We are proud to be a licensed tour operator with AQUILA, ensuring the highest quality standards for
                  all our tours.
                </p>
              </div>
            </div>
          )}

          {showSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  <i className="ri-check-line text-green-600"></i>
                </div>
                <p>Your booking request has been sent! We'll contact you shortly to confirm.</p>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Book {service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name*</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number*</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 782-377-7533"
                      />
                    </div>
                  </div>

                  {isAirportService && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="pickupLocation">Pickup Location*</Label>
                          <AddressAutocompleteV2
                            id="pickupLocation"
                            name="pickupLocation"
                            value={formData.pickupLocation}
                            onChange={handleAddressChange}
                            required={isAirportService}
                            placeholder="Airport or address"
                          />
                          <p className="text-xs text-gray-500">
                            You can select from suggestions or type any address manually
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dropoffLocation">Dropoff Location*</Label>
                          <AddressAutocompleteV2
                            id="dropoffLocation"
                            name="dropoffLocation"
                            value={formData.dropoffLocation}
                            onChange={handleAddressChange}
                            required={isAirportService}
                            placeholder="Hotel or address"
                          />
                          <p className="text-xs text-gray-500">
                            You can select from suggestions or type any address manually
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vehicleSize">Vehicle Size*</Label>
                        <Select
                          value={formData.vehicleSize}
                          onValueChange={(value) => handleSelectChange("vehicleSize", value)}
                          required={isAirportService}
                        >
                          <SelectTrigger id="vehicleSize">
                            <SelectValue placeholder="Select vehicle size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedan">Sedan (1-4 passengers)</SelectItem>
                            <SelectItem value="suv">SUV (1-6 passengers)</SelectItem>
                            <SelectItem value="van">Van (1-8 passengers)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date*</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CustomCalendar mode="single" selected={formData.date} onSelect={handleDateChange} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time*</Label>
                      <div className="flex">
                        <div className="relative flex-grow">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="time"
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            required
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {isTourService && (
                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">Additional Information</Label>
                      <Textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your tour preferences, number of people, special requests, etc."
                        rows={4}
                      />
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <Button
                        type="button"
                        onClick={() => handlePhoneCall(phoneNumber)}
                        className="flex-1 bg-primary text-white"
                      >
                        <i className="ri-phone-line mr-2"></i> Call to Book
                      </Button>
                      <Button type="submit" className="flex-1 bg-secondary text-black" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <i className="ri-send-plane-line mr-2"></i> Send Booking Request
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-500 mt-4">
                    <i className="ri-information-line mr-1"></i>
                    Please call {phoneNumber} to confirm all bookings after submitting this form.
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

