"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { peiLocations } from "@/lib/pei-locations"

interface AddressAutocompleteV2Props {
  id: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  label?: string
}

export default function AddressAutocompleteV2({
  id,
  name,
  value,
  onChange,
  placeholder,
  required,
  className,
  label,
}: AddressAutocompleteV2Props) {
  const [inputValue, setInputValue] = useState(value)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLUListElement>(null)

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredSuggestions([])
    } else {
      const searchTerms = inputValue
        .toLowerCase()
        .split(/[\s,]+/)
        .filter((term) => term.length > 0)

      const filtered = peiLocations
        .filter((location) => {
          const locationLower = location.toLowerCase()
          // Check if all search terms are found in the location
          return searchTerms.every((term) => locationLower.includes(term))
        })
        .slice(0, 10) // Limit to 10 suggestions for better performance

      setFilteredSuggestions(filtered)
    }
  }, [inputValue])

  // Handle clicks outside the component
  useEffect(() => {
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions || filteredSuggestions.length === 0) return

      if (e.key === "Escape") {
        setShowSuggestions(false)
      }

      if (suggestionsRef.current) {
        const items = suggestionsRef.current.querySelectorAll("li")
        const activeItem = document.activeElement as HTMLElement

        if (e.key === "ArrowDown") {
          e.preventDefault()
          if (!activeItem || !activeItem.classList.contains("suggestion-item")) {
            // Focus the first item if nothing is focused
            ;(items[0] as HTMLElement).focus()
          } else {
            // Find the current index and focus the next item
            const currentIndex = Array.from(items).indexOf(activeItem)
            const nextIndex = (currentIndex + 1) % items.length
            ;(items[nextIndex] as HTMLElement).focus()
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          if (!activeItem || !activeItem.classList.contains("suggestion-item")) {
            // Focus the last item if nothing is focused
            ;(items[items.length - 1] as HTMLElement).focus()
          } else {
            // Find the current index and focus the previous item
            const currentIndex = Array.from(items).indexOf(activeItem)
            const prevIndex = (currentIndex - 1 + items.length) % items.length
            ;(items[prevIndex] as HTMLElement).focus()
          }
        } else if (e.key === "Enter" && activeItem && activeItem.classList.contains("suggestion-item")) {
          e.preventDefault()
          activeItem.click()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [showSuggestions, filteredSuggestions])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(name, newValue)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    onChange(name, suggestion)
    setShowSuggestions(false)

    // Focus on the next input field if available
    if (inputRef.current) {
      const form = inputRef.current.form
      if (form) {
        const inputs = Array.from(form.elements) as HTMLElement[]
        const index = inputs.indexOf(inputRef.current)
        if (index !== -1 && index < inputs.length - 1) {
          ;(inputs[index + 1] as HTMLElement).focus()
        }
      }
    }
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text

    const searchTerms = query
      .toLowerCase()
      .split(/[\s,]+/)
      .filter((term) => term.length > 0)

    // Create a regex pattern that matches any of the search terms
    const pattern = searchTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")

    const regex = new RegExp(`(${pattern})`, "gi")
    const parts = text.split(regex)

    return (
      <>
        {parts.map((part, i) => {
          const isMatch = searchTerms.some((term) => part.toLowerCase().includes(term))
          return isMatch ? (
            <span key={i} className="bg-yellow-100 font-medium">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        })}
      </>
    )
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        ref={inputRef}
        id={id}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          setShowSuggestions(true)
          // Show initial suggestions if there's already text
          if (inputValue.trim().length > 0) {
            const searchTerms = inputValue
              .toLowerCase()
              .split(/[\s,]+/)
              .filter((term) => term.length > 0)

            const filtered = peiLocations
              .filter((location) => {
                const locationLower = location.toLowerCase()
                // Check if all search terms are found in the location
                return searchTerms.every((term) => locationLower.includes(term))
              })
              .slice(0, 10)

            setFilteredSuggestions(filtered)
          }
        }}
        placeholder={placeholder}
        required={required}
        className={className}
        aria-label={label || name}
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls={showSuggestions ? `${id}-suggestions` : undefined}
        aria-expanded={showSuggestions && filteredSuggestions.length > 0}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          id={`${id}-suggestions`}
          className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-auto address-autocomplete-dropdown"
          role="listbox"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 suggestion-item address-suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleSuggestionClick(suggestion)
                }
              }}
              role="option"
              aria-selected={false}
              tabIndex={0}
            >
              {highlightMatch(suggestion, inputValue)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

