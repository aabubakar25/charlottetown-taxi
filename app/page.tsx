"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import TabBar from "@/components/tab-bar"
import BookingFormV2 from "@/components/booking-form-v2"
import ServiceCard from "@/components/service-card"
import VehicleOptions from "@/components/vehicle-options"
import { handlePhoneCall } from "@/utils/phone-utils"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")
  const [scrollY, setScrollY] = useState(0)
  const phoneNumber = "782-377-7533"

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)

    // Scroll to appropriate section
    if (tab === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (tab === "book") {
      const bookingSection = document.getElementById("booking-section")
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth" })
      }
    } else if (tab === "contact") {
      const contactSection = document.getElementById("contact-section")
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  // Service data with extended descriptions
  const services = [
    {
      title: "Airport Transfers",
      description: "Premium pickup and drop-off service",
      longDescription:
        "Our airport transfer service provides reliable, comfortable transportation to and from Charlottetown Airport. We monitor flight arrivals to ensure we're there when you need us, even if your flight is delayed. Our drivers will help with your luggage and ensure you reach your destination safely and on time.",
      imageSrc: "https://public.readdy.ai/ai/img_res/7d091360c33a432c73d664366de62e6e.jpg",
    },
    {
      title: "City Tours",
      description: "Explore Charlottetown in style",
      longDescription:
        "Discover the beauty and history of Charlottetown with our guided city tours. Our knowledgeable drivers will take you to the most iconic landmarks, historical sites, and hidden gems of Prince Edward Island's capital. Customize your tour to focus on history, architecture, culture, or local cuisine.",
      imageSrc: "https://public.readdy.ai/ai/img_res/e7af6f2bf93243b1fe69aa39d9ed6ac0.jpg",
    },
    {
      title: "Corporate Accounts",
      description: "Executive service for business clients",
      longDescription:
        "Our corporate transportation services cater to businesses of all sizes. We offer reliable, punctual service for executive travel, client pickups, and employee transportation. Set up a corporate account for streamlined billing, priority booking, and customized service agreements tailored to your company's needs.",
      imageSrc: "https://public.readdy.ai/ai/img_res/4945c60541cd2f85bb45878b1359fa17.jpg",
    },
    {
      title: "24/7 Availability",
      description: "Luxury service round the clock",
      longDescription:
        "We understand that transportation needs don't follow a schedule. That's why our service is available 24 hours a day, 7 days a week, including holidays. Whether you need an early morning airport pickup, late-night transportation after an event, or anything in between, we're always just a call away.",
      imageSrc: "https://public.readdy.ai/ai/img_res/652b9e8550b1fd8e0787f20fdeaaef27.jpg",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar phoneNumber={phoneNumber} />

      <main className="pt-16 pb-20">
        {/* Hero Section */}
        <section className="relative h-[240px] mb-6">
          <img
            src="https://public.readdy.ai/ai/img_res/513f351598334bfd95127c7cc9c03229.jpg"
            alt="Prince Edward Island"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 flex flex-col justify-end p-4">
            <h1 className="text-white text-2xl font-bold mb-2">Premium Taxi Service in Charlottetown</h1>
            <p className="text-white/90 text-sm mb-4">Elegant, reliable & professional transportation</p>
            <button
              onClick={() => handlePhoneCall(phoneNumber)}
              className="bg-secondary text-black font-semibold py-3 px-6 rounded-md shadow-lg flex items-center justify-center cursor-pointer w-full md:w-auto"
            >
              <i className="ri-phone-line ri-lg mr-2"></i> Call for Taxi
            </button>
          </div>
        </section>

        {/* Booking Section */}
        <section id="booking-section" className="mx-4 mb-8">
          <BookingFormV2 />
        </section>

        {/* Vehicle Options Section */}
        <section id="vehicles-section" className="mx-4 mb-8">
          <VehicleOptions />
        </section>

        {/* Service Highlights */}
        <section id="services-section" className="px-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Our Services</h2>
            <p className="text-gray-600 text-sm mb-6">
              Click on any service below to get more information or make a booking request.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  description={service.description}
                  longDescription={service.longDescription}
                  imageSrc={service.imageSrc}
                  phoneNumber={phoneNumber}
                />
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <i className="ri-information-line text-primary mr-2"></i>
                <p>
                  <span className="font-medium">Important:</span> Please call {phoneNumber} to confirm all bookings
                  after submitting a request.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact-section" className="px-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full mr-3 flex-shrink-0">
                <i className="ri-phone-line text-primary"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Call us 24/7</p>
                <button onClick={() => handlePhoneCall(phoneNumber)} className="font-medium text-primary">
                  {phoneNumber}
                </button>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full mr-3 flex-shrink-0">
                <i className="ri-message-2-line text-primary"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Text us</p>
                <a href={`sms:${phoneNumber.replace(/-/g, "")}`} className="font-medium">
                  {phoneNumber}
                </a>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full mr-3 flex-shrink-0">
                <i className="ri-calendar-line text-primary"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Operating Hours</p>
                <p className="font-medium">24/7 Service Available</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full mr-3 flex-shrink-0">
                <i className="ri-map-pin-line text-primary"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Main Office</p>
                <p className="font-medium">72 Kensington Road, Charlottetown, PE</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <TabBar onTabChange={handleTabChange} />

      {/* Call Button */}
      <button
        onClick={() => handlePhoneCall(phoneNumber)}
        className="fixed bottom-20 right-4 w-12 h-12 bg-secondary rounded-full shadow-lg flex items-center justify-center cursor-pointer z-50"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <i className="ri-phone-line text-black ri-lg"></i>
        </div>
      </button>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-20 left-4 w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center cursor-pointer z-50 ${
          scrollY > 300 ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <i className="ri-arrow-up-line text-white ri-lg"></i>
        </div>
      </button>
    </div>
  )
}

