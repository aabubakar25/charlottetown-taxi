"use client"

import * as React from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CustomCalendarProps {
  mode?: "single" | "range" | "multiple"
  selected?: Date | Date[]
  onSelect?: (date: Date | Date[] | undefined) => void
  disabled?: boolean
  className?: string
}

export function CustomCalendar({
  mode = "single",
  selected,
  onSelect,
  disabled = false,
  className,
}: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(selected instanceof Date ? selected : new Date())

  const days = React.useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const handleDateSelect = (day: Date) => {
    if (disabled) return

    if (mode === "single") {
      onSelect?.(day)
    } else if (mode === "multiple" && Array.isArray(selected)) {
      const isSelected = selected.some((date) => isSameDay(date, day))
      if (isSelected) {
        onSelect?.(selected.filter((date) => !isSameDay(date, day)))
      } else {
        onSelect?.([...selected, day])
      }
    }
  }

  const isSelectedDate = (day: Date) => {
    if (!selected) return false

    if (mode === "single" && selected instanceof Date) {
      return isSameDay(day, selected)
    } else if (mode === "multiple" && Array.isArray(selected)) {
      return selected.some((date) => isSameDay(date, day))
    }

    return false
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
          disabled={disabled}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        <div className="font-medium">{format(currentMonth, "MMMM yyyy")}</div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
          disabled={disabled}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map(
          (_, i) => (
            <div key={`empty-${i}`} className="h-9 w-9" />
          ),
        )}
        {days.map((day) => {
          const isSelected = isSelectedDate(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isCurrentDay = isToday(day)

          return (
            <Button
              key={day.toString()}
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 p-0 font-normal",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                !isCurrentMonth && "text-muted-foreground opacity-50",
                isCurrentDay && !isSelected && "bg-accent text-accent-foreground",
              )}
              disabled={disabled || !isCurrentMonth}
              onClick={() => handleDateSelect(day)}
            >
              {format(day, "d")}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

