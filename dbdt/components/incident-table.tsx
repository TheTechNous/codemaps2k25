"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import type { Emergency, EmergencyStatus } from "@/lib/store"
import { useRouter } from "next/navigation"

interface IncidentTableProps {
  incidents: Emergency[]
  updateStatus: (id: string, status: EmergencyStatus) => void
}

export function IncidentTable({ incidents, updateStatus }: IncidentTableProps) {
  const [selectedIncident, setSelectedIncident] = useState<Emergency | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const router = useRouter()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="destructive">🔴 New</Badge>
      case "in-progress":
        return (
          <Badge variant="default" className="bg-yellow-500">
            🟡 In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            🟢 Resolved
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleViewDetails = (incident: Emergency) => {
    setSelectedIncident(incident)
    setDetailsOpen(true)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell>{incident.id}</TableCell>
                <TableCell>{incident.type}</TableCell>
                <TableCell>{incident.location}</TableCell>
                <TableCell>{incident.reportedBy}</TableCell>
                <TableCell>{format(new Date(incident.timestamp), "MMM d, h:mm a")}</TableCell>
                <TableCell>{getStatusBadge(incident.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(incident)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/admin/incidents/${incident.id}`)}>
                        View Full Detail
                      </DropdownMenuItem>
                      {incident.status === "new" && (
                        <DropdownMenuItem onClick={() => updateStatus(incident.id, "in-progress")}>
                          Mark In Progress
                        </DropdownMenuItem>
                      )}
                      {incident.status === "in-progress" && (
                        <DropdownMenuItem onClick={() => updateStatus(incident.id, "resolved")}>
                          Mark Resolved
                        </DropdownMenuItem>
                      )}
                      {incident.status === "resolved" && (
                        <DropdownMenuItem onClick={() => updateStatus(incident.id, "new")}>
                          Reopen Incident
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => window.open(`/admin/incidents/report/${incident.id}`, "_blank")}>
                        View Full Incident Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        {selectedIncident && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Incident Details: {selectedIncident.id}</DialogTitle>
              <DialogDescription>Complete information about this emergency incident</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Type:</span>
                <span className="col-span-3">{selectedIncident.type}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Location:</span>
                <span className="col-span-3">{selectedIncident.location}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Reported By:</span>
                <span className="col-span-3">{selectedIncident.reportedBy}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Time:</span>
                <span className="col-span-3">{format(new Date(selectedIncident.timestamp), "MMM d, yyyy h:mm a")}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Status:</span>
                <span className="col-span-3">{getStatusBadge(selectedIncident.status)}</span>
              </div>
              {selectedIncident.coordinates && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Coordinates:</span>
                  <span className="col-span-3">
                    {selectedIncident.coordinates.lat.toFixed(4)}, {selectedIncident.coordinates.lng.toFixed(4)}
                  </span>
                </div>
              )}
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Update Status <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => updateStatus(selectedIncident.id, "new")}>
                    Mark as New
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateStatus(selectedIncident.id, "in-progress")}>
                    Mark In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateStatus(selectedIncident.id, "resolved")}>
                    Mark Resolved
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}

