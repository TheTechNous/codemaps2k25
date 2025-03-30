"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface GeofencingMapProps {
  zones: any[]
  selectedZone: any | null
  onSelectZone: (zone: any | null) => void
  emergencies?: any[]
}

export function GeofencingMap({ zones, selectedZone, onSelectZone, emergencies = [] }: GeofencingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const { toast } = useToast()

  // Function to check if a point is inside a geofenced zone
  const isPointInZone = (point: { lat: number; lng: number }, zone: any) => {
    // This is a simplified implementation - in a real app, you would use proper geospatial calculations
    // For demo purposes, we'll just check if the point is within a simple bounding box
    const zoneCoords = zone.coordinates

    if (!zoneCoords || zoneCoords.length < 3) return false

    // Calculate bounding box
    const lats = zoneCoords.map((c) => c.lat)
    const lngs = zoneCoords.map((c) => c.lng)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    // Check if point is in bounding box
    return point.lat >= minLat && point.lat <= maxLat && point.lng >= minLng && point.lng <= maxLng
  }

  // Function to check alerts outside safe zones
  const checkAlertsOutsideSafeZones = () => {
    if (!emergencies || emergencies.length === 0) return []

    return emergencies.filter((emergency) => {
      if (!emergency.coordinates) return false

      // Check if emergency is outside all safe zones
      const safeZones = zones.filter((zone) => zone.type === "safe" && zone.status === "active")
      return !safeZones.some((zone) => isPointInZone(emergency.coordinates, zone))
    })
  }

  const alertsOutsideSafeZones = checkAlertsOutsideSafeZones()

  // Update the useEffect function to better display zones and incidents
  useEffect(() => {
    // This is a placeholder for a real map implementation
    // In a real application, you would use a library like Mapbox, Google Maps, or Leaflet
    if (mapRef.current) {
      const mapElement = mapRef.current

      // Clear previous content
      mapElement.innerHTML = ""

      // Create a simple placeholder map
      const mapPlaceholder = document.createElement("div")
      mapPlaceholder.className = "w-full h-full bg-gray-100 flex flex-col"

      // Add drawing mode controls
      const controlsContainer = document.createElement("div")
      controlsContainer.className = "bg-white p-4 border-b flex justify-between items-center"

      const title = document.createElement("h3")
      title.className = "font-medium"
      title.textContent = "Geofencing Map"

      const controlsRight = document.createElement("div")
      controlsRight.className = "flex gap-2"

      controlsContainer.appendChild(title)
      controlsContainer.appendChild(controlsRight)

      // Add alerts outside safe zones notification
      if (alertsOutsideSafeZones.length > 0) {
        const alertsContainer = document.createElement("div")
        alertsContainer.className = "bg-red-50 p-4 border-b flex items-center gap-2"

        const alertIcon = document.createElement("div")
        alertIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-red-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`

        const alertText = document.createElement("div")
        alertText.innerHTML = `<span class="font-medium text-red-800">Alert:</span> <span class="text-red-700">${alertsOutsideSafeZones.length} emergencies detected outside safe zones</span>`

        alertsContainer.appendChild(alertIcon)
        alertsContainer.appendChild(alertText)
        mapPlaceholder.appendChild(alertsContainer)
      }

      mapPlaceholder.appendChild(controlsContainer)

      const mapContent = document.createElement("div")
      mapContent.className = "flex-1 p-6 overflow-auto"

      // Create a more visual map representation
      const mapVisual = document.createElement("div")
      mapVisual.className = "relative w-full h-[400px] bg-blue-50 rounded-md border mb-4"

      // Add a simple campus outline
      const campusOutline = document.createElement("div")
      campusOutline.className = "absolute inset-10 border-2 border-dashed border-blue-300 rounded-lg"
      mapVisual.appendChild(campusOutline)

      // Add zone representations
      zones.forEach((zone) => {
        // Create a simple polygon representation
        const zoneEl = document.createElement("div")

        // Determine position and size based on zone type (simplified for demo)
        let position = { left: "20%", top: "20%", width: "30%", height: "30%" }

        if (zone.type === "safe") {
          position = { left: "20%", top: "20%", width: "30%", height: "30%" }
        } else if (zone.type === "restricted") {
          position = { left: "60%", top: "20%", width: "20%", height: "20%" }
        } else if (zone.type === "high-security") {
          position = { left: "20%", top: "60%", width: "20%", height: "20%" }
        } else if (zone.type === "monitored") {
          position = { left: "50%", top: "50%", width: "25%", height: "25%" }
        }

        // Style based on zone type
        let bgColor = "bg-green-200/50"
        let borderColor = "border-green-500"

        if (zone.type === "restricted") {
          bgColor = "bg-yellow-200/50"
          borderColor = "border-yellow-500"
        } else if (zone.type === "high-security") {
          bgColor = "bg-red-200/50"
          borderColor = "border-red-500"
        } else if (zone.type === "monitored") {
          bgColor = "bg-blue-200/50"
          borderColor = "border-blue-500"
        }

        // Highlight selected zone
        if (selectedZone && selectedZone.id === zone.id) {
          bgColor = bgColor.replace("/50", "/80")
          borderColor = borderColor.replace("border-", "border-2 border-")
        }

        // Only show active zones with solid fill
        if (zone.status !== "active") {
          bgColor = "bg-gray-200/30"
          borderColor = "border-gray-400"
        }

        zoneEl.className = `absolute ${bgColor} ${borderColor} border-2 rounded-md flex items-center justify-center`
        zoneEl.style.left = position.left
        zoneEl.style.top = position.top
        zoneEl.style.width = position.width
        zoneEl.style.height = position.height

        const zoneLabel = document.createElement("div")
        zoneLabel.className = "text-xs font-medium bg-white/80 px-2 py-1 rounded shadow"
        zoneLabel.textContent = zone.name
        zoneEl.appendChild(zoneLabel)

        // Make zone clickable
        zoneEl.style.cursor = "pointer"
        zoneEl.onclick = () => onSelectZone(selectedZone?.id === zone.id ? null : zone)

        mapVisual.appendChild(zoneEl)
      })

      // Add emergency markers
      if (emergencies && emergencies.length > 0) {
        emergencies.forEach((emergency) => {
          if (emergency.coordinates) {
            // Create a marker for each emergency
            const marker = document.createElement("div")
            marker.className =
              "absolute w-4 h-4 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"

            // Position based on coordinates (simplified for demo)
            // This provides more consistent and accurate marker placement
            const normalizedLng = ((emergency.coordinates.lng + 74.01) * 100) % 100
            const normalizedLat = ((emergency.coordinates.lat - 40.71) * 100) % 100
            const left = Math.min(Math.max(normalizedLng, 10), 90) + "%"
            const top = Math.min(Math.max(normalizedLat, 10), 90) + "%"
            marker.style.left = left
            marker.style.top = top

            // Check if emergency is outside safe zones
            const isOutsideSafeZone = alertsOutsideSafeZones.some((e) => e.id === emergency.id)
            const markerColor = isOutsideSafeZone ? "bg-red-500" : "bg-yellow-500"

            marker.innerHTML = `
              <div class="${markerColor} w-4 h-4 rounded-full border-2 border-white shadow-md"></div>
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
                ${emergency.type} at ${emergency.location}
              </div>
            `

            mapVisual.appendChild(marker)
          }
        })
      }

      mapContent.appendChild(mapVisual)

      // Drawing instructions when in drawing mode
      if (isDrawingMode) {
        const instructionsContainer = document.createElement("div")
        instructionsContainer.className = "mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md"

        const instructionsTitle = document.createElement("h4")
        instructionsTitle.className = "font-medium text-blue-800 mb-2"
        instructionsTitle.textContent = "Drawing Mode Instructions"

        const instructionsList = document.createElement("ul")
        instructionsList.className = "text-sm text-blue-700 list-disc pl-5 space-y-1"

        const instructions = [
          "Click on the map to place points and create a polygon",
          "Double-click to complete the polygon",
          "In a real implementation, you would be able to draw precise boundaries",
        ]

        instructions.forEach((instruction) => {
          const li = document.createElement("li")
          li.textContent = instruction
          instructionsList.appendChild(li)
        })

        instructionsContainer.appendChild(instructionsTitle)
        instructionsContainer.appendChild(instructionsList)
        mapContent.appendChild(instructionsContainer)
      }

      // Create zone markers
      const zonesContainer = document.createElement("div")
      zonesContainer.className = "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"

      zones.forEach((zone) => {
        const zoneMarker = document.createElement("div")
        zoneMarker.className = `p-4 border rounded-md cursor-pointer ${
          selectedZone?.id === zone.id ? "bg-primary/10 border-primary" : "bg-white"
        }`
        zoneMarker.onclick = () => onSelectZone(selectedZone?.id === zone.id ? null : zone)

        // Color based on type
        let typeColor = ""
        let typeBadge = ""
        switch (zone.type) {
          case "safe":
            typeColor = "border-l-4 border-l-green-500"
            typeBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Safe</span>`
            break
          case "restricted":
            typeColor = "border-l-4 border-l-yellow-500"
            typeBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Restricted</span>`
            break
          case "high-security":
            typeColor = "border-l-4 border-l-red-500"
            typeBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">High Security</span>`
            break
          case "monitored":
            typeColor = "border-l-4 border-l-blue-500"
            typeBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Monitored</span>`
            break
        }
        zoneMarker.className += ` ${typeColor}`

        const zoneHeader = document.createElement("div")
        zoneHeader.className = "flex justify-between items-start mb-2"

        const zoneTitle = document.createElement("h4")
        zoneTitle.className = "font-medium"
        zoneTitle.textContent = zone.name

        const zoneTypeEl = document.createElement("div")
        zoneTypeEl.innerHTML = typeBadge

        zoneHeader.appendChild(zoneTitle)
        zoneHeader.appendChild(zoneTypeEl)

        const zoneDetails = document.createElement("div")
        zoneDetails.className = "text-sm text-gray-500 space-y-1"

        const zoneDescription = document.createElement("p")
        zoneDescription.textContent = zone.description

        const zoneStatus = document.createElement("p")
        zoneStatus.innerHTML = `Status: <span class="${zone.status === "active" ? "text-green-600" : "text-gray-500"}">${zone.status}</span>`

        const zoneAlertLevel = document.createElement("p")
        zoneAlertLevel.textContent = `Alert Level: ${zone.alertLevel.toUpperCase()}`

        zoneDetails.appendChild(zoneDescription)
        zoneDetails.appendChild(zoneStatus)
        zoneDetails.appendChild(zoneAlertLevel)

        zoneMarker.appendChild(zoneHeader)
        zoneMarker.appendChild(zoneDetails)
        zonesContainer.appendChild(zoneMarker)
      })

      mapContent.appendChild(zonesContainer)
      mapPlaceholder.appendChild(mapContent)
      mapElement.appendChild(mapPlaceholder)
    }
  }, [zones, selectedZone, onSelectZone, emergencies, isDrawingMode, alertsOutsideSafeZones])

  return (
    <div className="flex flex-col h-full">
      <div ref={mapRef} className="flex-1 w-full">
        <div className="flex h-full w-full items-center justify-center">
          <p>Loading map...</p>
        </div>
      </div>

      {isDrawingMode && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsDrawingMode(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsDrawingMode(false)
                toast({
                  title: "Zone Created",
                  description: "New geofencing zone has been created successfully",
                })
              }}
            >
              Save Zone
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

