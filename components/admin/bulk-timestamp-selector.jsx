"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, CheckSquare, Square, Trash2, Download, X } from "lucide-react"
import { format } from "date-fns"

export function BulkTimestampSelector({ 
  onSelect, 
  onBulkAction,
  selectedCount = 0,
  totalCount = 0,
  actions = ["export", "delete"]
}) {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [startTime, setStartTime] = useState("00:00")
  const [endTime, setEndTime] = useState("23:59")
  const [isOpen, setIsOpen] = useState(false)

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const [startHours, startMinutes] = startTime.split(":")
      start.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0)

      const end = new Date(endDate)
      const [endHours, endMinutes] = endTime.split(":")
      end.setHours(parseInt(endHours), parseInt(endMinutes), 59, 999)

      if (onSelect) {
        onSelect({ start, end })
      }
      setIsOpen(false)
    }
  }

  const handleClearFilter = () => {
    setStartDate(null)
    setEndDate(null)
    setStartTime("00:00")
    setEndTime("23:59")
    if (onSelect) {
      onSelect(null)
    }
  }

  const handleBulkAction = (action) => {
    if (onBulkAction) {
      onBulkAction(action)
    }
  }

  const hasDateFilter = startDate && endDate

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Timestamp Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {hasDateFilter ? (
                    <span className="text-sm">
                      {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                    </span>
                  ) : (
                    "Select Date Range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Start Date</Label>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        className="rounded-md border"
                      />
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="h-8"
                        />
                      </div>
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">End Date</Label>
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => startDate && date < startDate}
                        className="rounded-md border"
                      />
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleApplyFilter}
                      disabled={!startDate || !endDate}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {hasDateFilter && (
              <Button variant="ghost" size="sm" onClick={handleClearFilter}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Selection Info & Bulk Actions */}
          <div className="flex items-center gap-3">
            {selectedCount > 0 && (
              <>
                <Badge variant="secondary" className="gap-1">
                  <CheckSquare className="h-3 w-3" />
                  {selectedCount} of {totalCount} selected
                </Badge>

                <div className="flex items-center gap-1">
                  {actions.includes("export") && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleBulkAction("export")}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  )}
                  {actions.includes("delete") && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleBulkAction("delete")}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  )}
                  {actions.includes("approve") && (
                    <Button 
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleBulkAction("approve")}
                    >
                      Approve All
                    </Button>
                  )}
                  {actions.includes("reject") && (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleBulkAction("reject")}
                    >
                      Reject All
                    </Button>
                  )}
                </div>
              </>
            )}

            {selectedCount === 0 && totalCount > 0 && (
              <span className="text-sm text-slate-500">
                {totalCount} items total
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
