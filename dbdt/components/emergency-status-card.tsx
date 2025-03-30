import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import type { Emergency } from "@/lib/store"

interface EmergencyStatusCardProps {
  emergency: Emergency
}

export function EmergencyStatusCard({ emergency }: EmergencyStatusCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="destructive">New</Badge>
      case "in-progress":
        return (
          <Badge variant="default" className="bg-yellow-500">
            In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const timeAgo = formatDistanceToNow(new Date(emergency.timestamp), { addSuffix: true })

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{emergency.type}</h3>
            <p className="text-sm text-muted-foreground">{emergency.details}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Reported {timeAgo}</span>
              <span>•</span>
              <span>Location: {emergency.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">{getStatusBadge(emergency.status)}</div>
        </div>
      </CardContent>
    </Card>
  )
}

