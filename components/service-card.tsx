"use client"

import { useState } from "react"
import ServiceDetailV2 from "./service-detail-v2"

interface ServiceCardProps {
  title: string
  description: string
  imageSrc: string
  phoneNumber: string
  longDescription?: string
}

export default function ServiceCard({ title, description, imageSrc, phoneNumber, longDescription }: ServiceCardProps) {
  const [showDetail, setShowDetail] = useState(false)

  const handleServiceClick = () => {
    setShowDetail(true)
  }

  return (
    <>
      <div
        className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleServiceClick}
      >
        <img src={imageSrc || "/placeholder.svg"} alt={title} className="w-16 h-16 mb-2 object-cover rounded-full" />
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
        <button className="mt-3 text-xs text-primary flex items-center">
          <i className="ri-information-line mr-1"></i> View Details
        </button>
      </div>

      {showDetail && (
        <ServiceDetailV2
          service={{ title, description, imageSrc, longDescription }}
          onClose={() => setShowDetail(false)}
          phoneNumber={phoneNumber}
        />
      )}
    </>
  )
}

