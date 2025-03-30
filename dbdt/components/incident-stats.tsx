import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"
import type { Emergency } from "@/lib/store"

interface IncidentStatsProps {
  incidents: Emergency[]
}

export function IncidentStats({ incidents }: IncidentStatsProps) {
  // Calculate statistics
  const totalIncidents = incidents.length
  const newIncidents = incidents.filter((i) => i.status === "new").length
  const inProgressIncidents = incidents.filter((i) => i.status === "in-progress").length
  const resolvedIncidents = incidents.filter((i) => i.status === "resolved").length

  // Calculate incident types
  const incidentTypes = incidents.reduce(
    (acc, incident) => {
      acc[incident.type] = (acc[incident.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Get the most common incident type
  let mostCommonType = "None"
  let mostCommonCount = 0

  Object.entries(incidentTypes).forEach(([type, count]) => {
    if (count > mostCommonCount) {
      mostCommonType = type
      mostCommonCount = count
    }
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">New Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-red-600">{newIncidents}</div>
            <div className="rounded-full bg-red-100 p-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Requires immediate attention</p>
        </CardContent>
      </Card>
      <Card className="bg-yellow-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-yellow-600">{inProgressIncidents}</div>
            <div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Currently being addressed</p>
        </CardContent>
      </Card>
      <Card className="bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-600">{resolvedIncidents}</div>
            <div className="rounded-full bg-green-100 p-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Successfully handled</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Most Common Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{mostCommonType}</div>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {mostCommonCount} incident{mostCommonCount !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

