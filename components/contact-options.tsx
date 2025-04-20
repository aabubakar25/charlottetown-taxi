"use client"

import { handlePhoneCall } from "@/utils/phone-utils"

export default function ContactOptions() {
  const phoneNumber = "782-377-7533"

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Book Your Taxi</h2>

      <p className="text-gray-600 mb-6">
        To book a taxi, please call or text us directly. Our dispatchers are available 24/7 to assist you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => handlePhoneCall(phoneNumber)}
          className="flex items-center justify-center gap-3 bg-primary text-white py-4 px-6 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <i className="ri-phone-line ri-lg"></i>
          <span className="font-medium">Call Now</span>
        </button>

        <a
          href={`sms:${phoneNumber.replace(/-/g, "")}`}
          className="flex items-center justify-center gap-3 bg-secondary text-black py-4 px-6 rounded-lg hover:bg-secondary/90 transition-colors"
        >
          <i className="ri-message-2-line ri-lg"></i>
          <span className="font-medium">Text Now</span>
        </a>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2 flex items-center">
          <i className="ri-information-line mr-2 text-primary"></i>
          What to provide when calling
        </h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start">
            <i className="ri-map-pin-line mt-0.5 mr-2 text-primary"></i>
            <span>Your pickup location</span>
          </li>
          <li className="flex items-start">
            <i className="ri-map-pin-line mt-0.5 mr-2 text-primary"></i>
            <span>Your destination</span>
          </li>
          <li className="flex items-start">
            <i className="ri-time-line mt-0.5 mr-2 text-primary"></i>
            <span>When you need the taxi (now or later)</span>
          </li>
          <li className="flex items-start">
            <i className="ri-user-line mt-0.5 mr-2 text-primary"></i>
            <span>Number of passengers</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

