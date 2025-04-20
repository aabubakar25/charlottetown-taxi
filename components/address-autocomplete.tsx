"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { peiLocations } from "@/lib/pei-locations"

interface AddressAutocompleteProps {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelect: (address: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  label?: string
}

export default function AddressAutocomplete({
  id,
  name,
  value,
  onChange,
  onSelect,
  placeholder,
  required,
  className,
  label,
}: AddressAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Filter locations based on input value
    if (value.trim() === "") {
      setFilteredSuggestions([])
    } else {
      const filtered = peiLocations
        .filter((location) => location.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5) // Limit to 5 suggestions
      setFilteredSuggestions(filtered)
    }
  }, [value])

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: string) => {
    // Create a synthetic event to pass to the onChange handler
    const syntheticEvent = {
      target: {
        name,
        value: suggestion,
      },
    } as React.ChangeEvent<HTMLInputElement>

    onChange(syntheticEvent)
    onSelect(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        id={id}
        name={name}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        required={required}
        className={className}
        aria-label={label || name}
        autoComplete="off"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

