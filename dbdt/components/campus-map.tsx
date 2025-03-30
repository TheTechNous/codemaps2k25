"use client"

import { useEffect, useRef } from "react"
import type { Emergency } from "@/lib/store"

interface CampusMapProps {
  buildings: any[]
  emergencies: Emergency[]
  selectedBuilding: string | null
  onSelectBuilding: (id: string | null) => void
}

export function CampusMap({ buildings, emergencies, selectedBuilding, onSelectBuilding }: CampusMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This is a placeholder for a real map implementation
    // In a real application, you would use a library like Mapbox, Google Maps, or Leaflet
    if (mapRef.current) {
      const mapElement = mapRef.current

      // Clear previous content
      mapElement.innerHTML = ""

      // Create a simple placeholder map
      const mapPlaceholder = document.createElement("div")
      mapPlaceholder.className = "w-full h-full bg-gray-100 flex items-center justify-center"

      // Create a more visual map representation
      const mapVisual = document.createElement("div")
      mapVisual.className = "relative w-[90%] h-[90%] bg-blue-50 rounded-md border"

      // Add a simple campus outline
      const campusOutline = document.createElement("div")
      campusOutline.className = "absolute inset-10 border-2 border-dashed border-blue-300 rounded-lg"
      mapVisual.appendChild(campusOutline)

      // Add building representations
      buildings.forEach((building) => {
        // Create a simple building representation
        const buildingEl = document.createElement("div")

        // Determine position and size based on building id (simplified for demo)
        let position = { left: "20%", top: "20%", width: "15%", height: "15%" }

        if (building.id === "lib") {
          position = { left: "20%", top: "20%", width: "15%", height: "15%" }
        } else if (building.id === "sci") {
          position = { left: "50%", top: "20%", width: "20%", height: "10%" }
        } else if (building.id === "admin") {
          position = { left: "70%", top: "30%", width: "15%", height: "20%" }
        } else if (building.id === "dorm-a") {
          position = { left: "20%", top: "50%", width: "15%", height: "20%" }
        } else if (building.id === "dorm-b") {
          position = { left: "40%", top: "50%", width: "15%", height: "20%" }
        } else if (building.id === "gym") {
          position = { left: "70%", top: "60%", width: "20%", height: "15%" }
        } else if (building.id === "cafe") {
          position = { left: "50%", top: "70%", width: "10%", height: "10%" }
        } else if (building.id === "park") {
          position = { left: "30%", top: "75%", width: "15%", height: "15%" }
        }

        // Highlight selected building
        const bgColor = selectedBuilding === building.id ? "bg-primary/20" : "bg-blue-200"
        const borderColor = selectedBuilding === building.id ? "border-primary" : "border-blue-300"

        buildingEl.className = `absolute ${bgColor} ${borderColor} border-2 rounded-md flex items-center justify-center cursor-pointer`
        buildingEl.style.left = position.left
        buildingEl.style.top = position.top
        buildingEl.style.width = position.width
        buildingEl.style.height = position.height
        buildingEl.textContent = building.name
        buildingEl.onclick = () => onSelectBuilding(building.id === selectedBuilding ? null : building.id)

        mapVisual.appendChild(buildingEl)
      })

      // Add emergency markers
      emergencies.forEach((emergency) => {
        if (emergency.coordinates) {
          // Create a marker for each emergency
          const marker = document.createElement("div")
          marker.className =
            "absolute w-4 h-4 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"

          // Position based on coordinates (simplified for demo)
          const left = (((emergency.coordinates.lng + 74.01) * 1000) % 80) + 10 + "%"
          const top = (((emergency.coordinates.lat - 40.71) * 1000) % 80) + 10 + "%"
          marker.style.left = left
          marker.style.top = top

          // Style based on status
          let markerColor = "bg-red-500"
          if (emergency.status === "in-progress") {
            markerColor = "bg-yellow-500"
          } else if (emergency.status === "resolved") {
            markerColor = "bg-green-500"
          }

          marker.innerHTML = `
            <div class="${markerColor} w-4 h-4 rounded-full border-2 border-white shadow-md"></div>
            <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
              ${emergency.type} at ${emergency.location}
            </div>
          `

          mapVisual.appendChild(marker)
        }
      })

      mapPlaceholder.appendChild(mapVisual)
      mapElement.appendChild(mapPlaceholder)
    }
  }, [buildings, emergencies, selectedBuilding, onSelectBuilding])

  return (
    <div ref={mapRef} className="h-full w-full">
      <div className="flex h-full w-full items-center justify-center">
        <p>Loading map...</p>
      </div>
    </div>
  )
}

