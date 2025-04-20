"use client"

import { useState, useEffect } from "react"
import { handlePhoneCall } from "@/utils/phone-utils"

interface NavbarProps {
  phoneNumber: string
}

export default function Navbar({ phoneNumber }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-primary shadow-md py-2" : "bg-primary/90 py-3"
      }`}
    >
      <div className="px-4 flex justify-between items-center">
        <div className="font-pacifico text-xl text-secondary flex items-center">
          <i className="ri-taxi-fill ri-lg mr-1"></i>
          CHARLOTTETOWN TAXI
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handlePhoneCall(phoneNumber)}
            className="flex items-center text-white text-sm bg-primary/30 px-3 py-2 rounded-full hover:bg-primary/50 transition-colors"
          >
            <div className="w-5 h-5 flex items-center justify-center mr-1">
              <i className="ri-phone-fill text-secondary"></i>
            </div>
            <span className="hidden sm:block">{phoneNumber}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

