"use client"

import { useEffect, useRef, useState } from "react"
import type { Emergency } from "@/lib/store"

interface IncidentMapProps {
  incidents: Emergency[]
  showHeatmap?: boolean
}

export function IncidentMap({ incidents, showHeatmap = false }: IncidentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [activeView, setActiveView] = useState<"standard" | "heatmap">(showHeatmap ? "heatmap" : "standard")

  // Function to generate heatmap data based on incidents
  const generateHeatmapData = () => {
    // In a real implementation, this would use proper geospatial calculations
    // For this demo, we'll create a simple grid-based heatmap

    // Create a grid of campus areas
    const campusAreas = [
      { name: "Main Quad", incidents: 0, risk: "low" },
      { name: "Library", incidents: 0, risk: "low" },
      { name: "Ai-Block", incidents: 0, risk: "low" },
      { name: "c-Block", incidents: 0, risk: "low" },
      { name: "A-block", incidents: 0, risk: "low" },
      { name: "B-block", incidents: 0, risk: "low" },
      { name: "Sports Complex", incidents: 0, risk: "low" },
      { name: "H-block", incidents: 0, risk: "low" },
      { name: "G-block", incidents: 0, risk: "low" },
    ]

    // Count incidents in each area
    incidents.forEach((incident) => {
      // In a real app, we would use the incident's coordinates to determine which area it's in
      // For this demo, we'll use the location string to match to an area

      if (incident.location.includes("Library")) {
        campusAreas[1].incidents++
      } else if (incident.location.includes("Science")) {
        campusAreas[2].incidents++
      } else if (incident.location.includes("Union")) {
        campusAreas[3].incidents++
      } else if (incident.location.includes("Dormitory A") || incident.location.includes("Dorm A")) {
        campusAreas[4].incidents++
      } else if (incident.location.includes("Dormitory B") || incident.location.includes("Dorm B")) {
        campusAreas[5].incidents++
      } else if (incident.location.includes("Sports") || incident.location.includes("Gym")) {
        campusAreas[6].incidents++
      } else if (incident.location.includes("Parking") && incident.location.includes("A")) {
        campusAreas[7].incidents++
      } else if (incident.location.includes("Parking") && incident.location.includes("B")) {
        campusAreas[8].incidents++
      } else {
        // Default to Main Quad for any other location
        campusAreas[0].incidents++
      }
    })

    // Determine risk level based on incident count
    campusAreas.forEach((area) => {
      if (area.incidents >= 3) {
        area.risk = "high"
      } else if (area.incidents >= 1) {
        area.risk = "medium"
      } else {
        area.risk = "low"
      }
    })

    return campusAreas
  }

  const heatmapData = generateHeatmapData()

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

      // Add map controls
      const controlsContainer = document.createElement("div")
      controlsContainer.className = "bg-white p-4 border-b flex justify-between items-center"

      const title = document.createElement("h3")
      title.className = "font-medium"
      title.textContent = activeView === "standard" ? "Incident Map" : "Incident Heatmap"

      const viewToggle = document.createElement("div")
      viewToggle.className = "flex border rounded-md overflow-hidden"

      const standardButton = document.createElement("button")
      standardButton.className = `px-3 py-1.5 text-sm ${activeView === "standard" ? "bg-primary text-white" : "bg-white"}`
      standardButton.textContent = "Standard"

      const heatmapButton = document.createElement("button")
      heatmapButton.className = `px-3 py-1.5 text-sm ${activeView === "heatmap" ? "bg-primary text-white" : "bg-white"}`
      heatmapButton.textContent = "Heatmap"

      standardButton.onclick = () => setActiveView("standard")
      heatmapButton.onclick = () => setActiveView("heatmap")

      viewToggle.appendChild(standardButton)
      viewToggle.appendChild(heatmapButton)

      controlsContainer.appendChild(title)
      controlsContainer.appendChild(viewToggle)
      mapPlaceholder.appendChild(controlsContainer)

      const mapContent = document.createElement("div")
      mapContent.className = "flex-1 p-6 overflow-auto"

      if (activeView === "standard") {
        // Create a more visual map representation
        const mapVisual = document.createElement("div")
        mapVisual.className = "relative w-full h-[400px] bg-blue-50 rounded-md border mb-4"

        // Add a simple campus outline
        const campusOutline = document.createElement("div")
        campusOutline.className = "absolute inset-10 border-2 border-dashed border-blue-300 rounded-lg"
        mapVisual.appendChild(campusOutline)

        // Add building representations
        const buildings = [
          { name: "Library", left: "20%", top: "30%", width: "15%", height: "15%" },
          { name: "Science Building", left: "50%", top: "20%", width: "20%", height: "10%" },
          { name: "Student Center", left: "30%", top: "60%", width: "25%", height: "15%" },
          { name: "Admin Building", left: "70%", top: "50%", width: "15%", height: "20%" },
        ]

        buildings.forEach((building) => {
          const buildingEl = document.createElement("div")
          buildingEl.className =
            "absolute bg-blue-200 border border-blue-300 rounded-sm flex items-center justify-center text-xs font-medium"
          buildingEl.style.left = building.left
          buildingEl.style.top = building.top
          buildingEl.style.width = building.width
          buildingEl.style.height = building.height
          buildingEl.textContent = building.name
          mapVisual.appendChild(buildingEl)
        })

        // Add incident markers
        incidents.forEach((incident) => {
          if (incident.coordinates) {
            // Convert coordinates to relative position on our simple map
            // This is a very simplified conversion just for demonstration
            const normalizedLng = ((incident.coordinates.lng + 74.01) * 100) % 100
            const normalizedLat = ((incident.coordinates.lat - 40.71) * 100) % 100
            const left = Math.min(Math.max(normalizedLng, 10), 90) + "%"
            const top = Math.min(Math.max(normalizedLat, 10), 90) + "%"

            const marker = document.createElement("div")
            marker.className =
              "absolute w-4 h-4 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
            marker.style.left = left
            marker.style.top = top

            // Color based on status
            let bgColor = ""
            switch (incident.status) {
              case "new":
                bgColor = "bg-red-500"
                break
              case "in-progress":
                bgColor = "bg-yellow-500"
                break
              case "resolved":
                bgColor = "bg-green-500"
                break
            }

            marker.innerHTML = `
              <div class="${bgColor} w-4 h-4 rounded-full border-2 border-white shadow-md"></div>
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
                ${incident.type} at ${incident.location}
              </div>
            `

            mapVisual.appendChild(marker)
          }
        })

        mapContent.appendChild(mapVisual)

        // Create incident markers list
        const incidentsList = document.createElement("div")
        incidentsList.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"

        incidents.forEach((incident) => {
          const incidentMarker = document.createElement("div")
          incidentMarker.className = "p-4 border rounded-md bg-white"

          // Color based on status
          let statusColor = ""
          switch (incident.status) {
            case "new":
              statusColor = "border-l-4 border-l-red-500"
              break
            case "in-progress":
              statusColor = "border-l-4 border-l-yellow-500"
              break
            case "resolved":
              statusColor = "border-l-4 border-l-green-500"
              break
          }
          incidentMarker.className += ` ${statusColor}`

          const incidentTitle = document.createElement("h4")
          incidentTitle.className = "font-medium"
          incidentTitle.textContent = `${incident.id}: ${incident.type}`

          const incidentLocation = document.createElement("p")
          incidentLocation.className = "text-sm"
          incidentLocation.textContent = incident.location

          if (incident.coordinates) {
            const incidentCoords = document.createElement("p")
            incidentCoords.className = "text-xs text-muted-foreground"
            incidentCoords.textContent = `Coordinates: ${incident.coordinates.lat.toFixed(4)}, ${incident.coordinates.lng.toFixed(4)}`
            incidentMarker.appendChild(incidentCoords)
          }

          incidentMarker.appendChild(incidentTitle)
          incidentMarker.appendChild(incidentLocation)

          incidentsList.appendChild(incidentMarker)
        })

        mapContent.appendChild(incidentsList)
      } else {
        // Create heatmap visualization
        const heatmapContainer = document.createElement("div")
        heatmapContainer.className = "space-y-6"

        const heatmapDescription = document.createElement("p")
        heatmapDescription.className = "text-sm text-muted-foreground"
        heatmapDescription.textContent =
          "This heatmap shows high-risk areas based on incident frequency. Red indicates high-risk areas, yellow indicates moderate risk, and green indicates low risk."

        const heatmapLegend = document.createElement("div")
        heatmapLegend.className = "flex items-center gap-4 mb-4"

        const highRisk = document.createElement("div")
        highRisk.className = "flex items-center gap-1"
        highRisk.innerHTML = `<span class="inline-block w-4 h-4 bg-red-500 rounded-sm"></span> <span class="text-sm">High Risk (3+ incidents)</span>`

        const mediumRisk = document.createElement("div")
        mediumRisk.className = "flex items-center gap-1"
        mediumRisk.innerHTML = `<span class="inline-block w-4 h-4 bg-yellow-500 rounded-sm"></span> <span class="text-sm">Medium Risk (1-2 incidents)</span>`

        const lowRisk = document.createElement("div")
        lowRisk.className = "flex items-center gap-1"
        lowRisk.innerHTML = `<span class="inline-block w-4 h-4 bg-green-500 rounded-sm"></span> <span class="text-sm">Low Risk (0 incidents)</span>`

        heatmapLegend.appendChild(highRisk)
        heatmapLegend.appendChild(mediumRisk)
        heatmapLegend.appendChild(lowRisk)

        const heatmapGrid = document.createElement("div")
        heatmapGrid.className = "grid grid-cols-3 gap-4"

        heatmapData.forEach((area) => {
          const areaBox = document.createElement("div")
          let bgColor = ""

          switch (area.risk) {
            case "high":
              bgColor = "bg-red-100 border-red-500"
              break
            case "medium":
              bgColor = "bg-yellow-100 border-yellow-500"
              break
            case "low":
              bgColor = "bg-green-100 border-green-500"
              break
          }

          areaBox.className = `p-4 border-l-4 rounded-md ${bgColor}`

          const areaName = document.createElement("h4")
          areaName.className = "font-medium"
          areaName.textContent = area.name

          const areaIncidents = document.createElement("p")
          areaIncidents.className = "text-sm mt-1"
          areaIncidents.textContent = `${area.incidents} incident${area.incidents !== 1 ? "s" : ""}`

          const areaRisk = document.createElement("p")
          areaRisk.className = "text-xs mt-1"
          areaRisk.textContent = `Risk Level: ${area.risk.charAt(0).toUpperCase() + area.risk.slice(1)}`

          areaBox.appendChild(areaName)
          areaBox.appendChild(areaIncidents)
          areaBox.appendChild(areaRisk)

          heatmapGrid.appendChild(areaBox)
        })

        heatmapContainer.appendChild(heatmapDescription)
        heatmapContainer.appendChild(heatmapLegend)
        heatmapContainer.appendChild(heatmapGrid)

        mapContent.appendChild(heatmapContainer)
      }

      mapPlaceholder.appendChild(mapContent)
      mapElement.appendChild(mapPlaceholder)
    }
  }, [incidents, activeView, heatmapData])

  return (
    <div className="flex flex-col h-full">
      <div ref={mapRef} className="flex-1 w-full">
        <div className="flex h-full w-full items-center justify-center">
          <p>Loading map...</p>
        </div>
      </div>
    </div>
  )
}

