"use client"

import { useState } from "react"

interface TabBarProps {
  onTabChange: (tab: string) => void
}

export default function TabBar({ onTabChange }: TabBarProps) {
  const [activeTab, setActiveTab] = useState("home")

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    onTabChange(tab)
  }

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 px-2 py-2 grid grid-cols-3 z-50 shadow-lg">
      <a
        href="#"
        className="flex flex-col items-center justify-center cursor-pointer"
        onClick={(e) => {
          e.preventDefault()
          handleTabClick("home")
        }}
      >
        <div
          className={`w-6 h-6 flex items-center justify-center ${activeTab === "home" ? "text-primary" : "text-gray-500"}`}
        >
          <i className={`ri-home-5-${activeTab === "home" ? "fill" : "line"}`}></i>
        </div>
        <span className={`text-xs mt-1 ${activeTab === "home" ? "text-primary font-medium" : "text-gray-500"}`}>
          Home
        </span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center justify-center cursor-pointer"
        onClick={(e) => {
          e.preventDefault()
          handleTabClick("book")
        }}
      >
        <div
          className={`w-6 h-6 flex items-center justify-center ${activeTab === "book" ? "text-primary" : "text-gray-500"}`}
        >
          <i className={`ri-taxi-${activeTab === "book" ? "fill" : "line"}`}></i>
        </div>
        <span className={`text-xs mt-1 ${activeTab === "book" ? "text-primary font-medium" : "text-gray-500"}`}>
          Book
        </span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center justify-center cursor-pointer"
        onClick={(e) => {
          e.preventDefault()
          handleTabClick("contact")
        }}
      >
        <div
          className={`w-6 h-6 flex items-center justify-center ${activeTab === "contact" ? "text-primary" : "text-gray-500"}`}
        >
          <i className={`ri-information-${activeTab === "contact" ? "fill" : "line"}`}></i>
        </div>
        <span className={`text-xs mt-1 ${activeTab === "contact" ? "text-primary font-medium" : "text-gray-500"}`}>
          Info
        </span>
      </a>
    </div>
  )
}

