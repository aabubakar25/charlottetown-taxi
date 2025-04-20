"use client"

import { handlePhoneCall } from "@/utils/phone-utils"

export default function VehicleOptions() {
  const phoneNumber = "782-377-7533"

  const vehicles = [
    {
      type: "Sedan",
      icon: "ri-taxi-line",
      capacity: "Up to 4 passengers",
      luggage: "3 standard suitcases",
      description: "Comfortable and economical option for small groups or individuals.",
      image: "https://public.readdy.ai/ai/img_res/7d091360c33a432c73d664366de62e6e.jpg",
    },
    {
      type: "SUV",
      icon: "ri-car-line",
      capacity: "Up to 6 passengers",
      luggage: "4-5 standard suitcases",
      description: "Spacious option for medium-sized groups with extra luggage.",
      image: "https://public.readdy.ai/ai/img_res/4945c60541cd2f85bb45878b1359fa17.jpg",
    },
    {
      type: "Van",
      icon: "ri-bus-line",
      capacity: "Up to 8 passengers",
      luggage: "6+ standard suitcases",
      description: "Ideal for larger groups or when extra space is needed.",
      image: "https://public.readdy.ai/ai/img_res/652b9e8550b1fd8e0787f20fdeaaef27.jpg",
    },
  ]

  const handleBookVehicle = (vehicleType: string) => {
    // Format the booking message
    const message = `I'd like to book a ${vehicleType} taxi. Please contact me to arrange pickup details.`

    // Encode the message for SMS
    const encodedMessage = encodeURIComponent(message)

    // Create SMS link
    const smsLink = `sms:${phoneNumber.replace(/-/g, "")}?body=${encodedMessage}`

    // Open SMS app with pre-filled message
    window.location.href = smsLink
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Our Vehicle Options</h2>

      <div className="space-y-6">
        {vehicles.map((vehicle, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 h-48 md:h-auto relative">
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={`${vehicle.type} Taxi`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 md:w-2/3">
                <div className="flex items-center mb-2">
                  <i className={`${vehicle.icon} text-xl text-primary mr-2`}></i>
                  <h3 className="text-lg font-semibold">{vehicle.type}</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center text-sm">
                    <i className="ri-user-line text-gray-500 mr-2"></i>
                    <span>{vehicle.capacity}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="ri-suitcase-line text-gray-500 mr-2"></i>
                    <span>{vehicle.luggage}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{vehicle.description}</p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleBookVehicle(vehicle.type)}
                    className="flex-1 bg-secondary text-black py-2 px-4 rounded-md text-sm flex items-center justify-center"
                  >
                    <i className="ri-message-2-line mr-2"></i> Book via SMS
                  </button>
                  <button
                    onClick={() => handlePhoneCall(phoneNumber)}
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-md text-sm flex items-center justify-center"
                  >
                    <i className="ri-phone-line mr-2"></i> Call to Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

