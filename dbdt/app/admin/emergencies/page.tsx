"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminEmergencies() {
  interface Emergency {
    id: string
    type: string
    details: string
    location: string
    reportedBy: string
    status: string
    createdAt: string
  }

  const [emergencies, setEmergencies] = useState<Emergency[]>([])

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const response = await fetch("/api/emergencies")
        const data = await response.json()
        setEmergencies(data)
      } catch (error) {
        console.error("Error fetching emergencies:", error)
      }
    }

    fetchEmergencies()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Emergency Reports</h1>
      <div className="grid gap-6 mt-6">
        {emergencies.length > 0 ? (
          emergencies.map((emergency) => (
            <Card key={emergency.id}>
              <CardHeader>
                <CardTitle>{emergency.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Details:</strong> {emergency.details}
                </p>
                <p>
                  <strong>Location:</strong> {emergency.location}
                </p>
                <p>
                  <strong>Reported By:</strong> {emergency.reportedBy}
                </p>
                <p>
                  <strong>Status:</strong> {emergency.status}
                </p>
                <p>
                  <strong>Reported At:</strong> {new Date(emergency.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No emergencies reported yet.</p>
        )}
      </div>
    </div>
  )
}

