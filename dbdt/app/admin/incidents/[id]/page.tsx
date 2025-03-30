"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Phone,
  MessageSquare,
  Shield,
  Video,
  Mic,
  ImageIcon,
  ArrowLeft,
  Mail,
} from "lucide-react"

export default function IncidentDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { currentUser, emergencies, updateEmergencyStatus } = useStore()

  const [incident, setIncident] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [responseNote, setResponseNote] = useState("")
  const [assignedPersonnel, setAssignedPersonnel] = useState<string[]>([])

  // Sample security personnel data
  const securityPersonnel = [
    { id: "SP001", name: "Naval", role: "Security Officer", status: "on-duty" },
    { id: "SP002", name: "Shashwat", role: "Security Supervisor", status: "on-duty" },
    { id: "SP003", name: "Parth", role: "Security Officer", status: "off-duty" },
    { id: "SP004", name: "Krish", role: "Security Officer", status: "on-duty" },
  ]

  // Sample response logs
  const [responseLogs, setResponseLogs] = useState([
    {
      id: "log1",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      user: "Admin Security",
      action: "Incident created",
      details: "Emergency alert received from student",
    },
  ])

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/admin/login")
    } else if (currentUser.role !== "admin") {
      router.push("/")
    }
  }, [currentUser, router])

  // Fetch incident details
  useEffect(() => {
    if (params.id) {
      const incidentId = params.id as string
      const foundIncident = emergencies.find((e) => e.id === incidentId)

      if (foundIncident) {
        setIncident(foundIncident)
      } else {
        toast({
          title: "Incident not found",
          description: "The requested incident could not be found",
          variant: "destructive",
        })
        router.push("/admin/incidents")
      }

      setLoading(false)
    }
  }, [params.id, emergencies, router, toast])

  const handleStatusChange = (newStatus: "new" | "in-progress" | "resolved") => {
    if (!incident) return

    updateEmergencyStatus(incident.id, newStatus)

    // Update local incident state
    setIncident({
      ...incident,
      status: newStatus,
    })

    // Add to response logs
    addResponseLog(`Status updated to ${newStatus}`, `Incident status changed to ${newStatus}`)

    toast({
      title: "Status Updated",
      description: `Incident status has been updated to ${newStatus}`,
    })
  }

  const handleAssignPersonnel = () => {
    if (!incident || assignedPersonnel.length === 0) return

    // In a real app, this would make an API call to assign personnel

    // Get personnel names for the log
    const personnelNames = assignedPersonnel
      .map((id) => {
        const person = securityPersonnel.find((p) => p.id === id)
        return person ? person.name : id
      })
      .join(", ")

    // Add to response logs
    addResponseLog(`Personnel assigned`, `Assigned security personnel: ${personnelNames}`)

    toast({
      title: "Personnel Assigned",
      description: `Security personnel have been assigned to this incident`,
    })
  }

  const handleAddNote = () => {
    if (!incident || !responseNote.trim()) return

    // Add to response logs
    addResponseLog(`Response note added`, responseNote)

    setResponseNote("")

    toast({
      title: "Note Added",
      description: `Your response note has been added to the incident log`,
    })
  }

  const addResponseLog = (action: string, details: string) => {
    const newLog = {
      id: `log${responseLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: currentUser?.name || "Admin",
      action,
      details,
    }

    setResponseLogs([...responseLogs, newLog])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            New
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="default" className="bg-yellow-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (loading || !incident) {
    return (
      <div className="flex min-h-screen flex-col">
        <AdminHeader />
        <SidebarBackdrop />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <p>Loading incident details...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <SidebarBackdrop />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="grid gap-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => router.push("/admin/incidents")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Incidents
              </Button>
            </div>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Incident Details</h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-muted-foreground">ID: {incident.id}</p>
                  {getStatusBadge(incident.status)}
                </div>
              </div>
              <div className="flex gap-2">
                {incident.status === "new" && (
                  <Button onClick={() => handleStatusChange("in-progress")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Mark In Progress
                  </Button>
                )}
                {incident.status === "in-progress" && (
                  <Button onClick={() => handleStatusChange("resolved")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Resolved
                  </Button>
                )}
                {incident.status === "resolved" && (
                  <Button variant="outline" onClick={() => handleStatusChange("new")}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Reopen Incident
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Incident Information</CardTitle>
                    <CardDescription>Details about the reported emergency</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                        <p className="text-lg font-medium">{incident.type}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Reported At</h3>
                        <p>{new Date(incident.timestamp).toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                        <p>{incident.location}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Reported By</h3>
                        <p>{incident.reportedBy}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Details</h3>
                      <p className="p-3 bg-muted rounded-md">{incident.details}</p>
                    </div>

                    {incident.media && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Media</h3>
                        <div className="border rounded-md p-4">
                          {incident.media.type === "video" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Video className="h-5 w-5 text-primary" />
                                <span className="font-medium">Video Recording</span>
                              </div>
                              <video src={incident.media.url} controls className="w-full rounded-md" />
                            </div>
                          )}

                          {incident.media.type === "audio" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Mic className="h-5 w-5 text-primary" />
                                <span className="font-medium">Audio Recording</span>
                              </div>
                              <audio src={incident.media.url} controls className="w-full" />
                            </div>
                          )}

                          {incident.media.type === "image" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5 text-primary" />
                                <span className="font-medium">Photo</span>
                              </div>
                              <img
                                src={incident.media.url || "/placeholder.svg"}
                                alt="Incident"
                                className="w-full rounded-md"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Logs</CardTitle>
                    <CardDescription>History of actions taken for this incident</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {responseLogs.map((log) => (
                        <div key={log.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                          <div className="rounded-full bg-primary/10 p-2 h-fit">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{log.action}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{log.details}</p>
                            <p className="text-xs text-muted-foreground">By: {log.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Location</CardTitle>
                    <CardDescription>Incident location on campus map</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {incident.coordinates ? (
                      <div className="space-y-4">
                        <div className="aspect-square rounded-md overflow-hidden" style={{ height: "300px" }}>
                          {/* Interactive Map */}
                          <div className="relative h-full w-full bg-gray-100">
                            {/* This is a simplified map representation */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <div className="mb-4 text-center">
                                <p className="font-medium">Incident Location</p>
                                <p className="text-sm text-muted-foreground">{incident.location}</p>
                                <p className="text-xs text-muted-foreground">
                                  Coordinates: {incident.coordinates.lat.toFixed(6)},{" "}
                                  {incident.coordinates.lng.toFixed(6)}
                                </p>
                              </div>
                              <div className="relative h-[200px] w-[200px] bg-blue-50 rounded-md border">
                                {/* Simplified map with incident marker */}
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    backgroundColor: "rgba(220, 38, 38, 0.8)",
                                    border: "2px solid white",
                                    boxShadow: "0 0 0 2px rgba(220, 38, 38, 0.3), 0 0 10px rgba(0, 0, 0, 0.2)",
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent text-white p-3">
                              <p className="text-sm font-medium">{incident.location}</p>
                              <p className="text-xs">Emergency reported at this location</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm space-y-1">
                          <p className="font-medium">GPS Coordinates:</p>
                          <p>Latitude: {incident.coordinates.lat.toFixed(6)}</p>
                          <p>Longitude: {incident.coordinates.lng.toFixed(6)}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <MapPin className="mr-2 h-4 w-4" />
                            Open in Campus Map
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-center">
                        <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No precise location data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                    <CardDescription>Details about the reporting student</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder-user.jpg" alt="Student" />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{incident.reportedBy}</p>
                        <p className="text-sm text-muted-foreground">Student ID: ST12345</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>Random</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>https://shooliniuniversity.com/contact</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Assign Personnel</CardTitle>
                    <CardDescription>Assign security staff to this incident</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select
                      value={assignedPersonnel.length > 0 ? assignedPersonnel[0] : undefined}
                      onValueChange={(value) => setAssignedPersonnel([value])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select personnel" />
                      </SelectTrigger>
                      <SelectContent>
                        {securityPersonnel
                          .filter((p) => p.status === "on-duty")
                          .map((person) => (
                            <SelectItem key={person.id} value={person.id}>
                              {person.name} - {person.role}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Button
                      className="w-full"
                      onClick={handleAssignPersonnel}
                      disabled={assignedPersonnel.length === 0}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Assign to Incident
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Add Response Note</CardTitle>
                    <CardDescription>Document actions taken for this incident</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Enter response details..."
                      value={responseNote}
                      onChange={(e) => setResponseNote(e.target.value)}
                    />
                    <Button className="w-full" onClick={handleAddNote} disabled={!responseNote.trim()}>
                      Add Note
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

