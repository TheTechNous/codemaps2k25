"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  MapPin,
  Printer,
  Shield,
  Video,
  Mic,
  ImageIcon,
  ArrowLeft,
} from "lucide-react"

export default function IncidentReportPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { currentUser, emergencies } = useStore()

  const [incident, setIncident] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    // Check if user is logged in - but don't redirect immediately
    // This allows the component to render properly when the user is authenticated
    if (currentUser && currentUser.role !== "admin") {
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

  const handleGenerateReport = () => {
    setIsGeneratingReport(true)

    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false)

      toast({
        title: "Report Generated",
        description: "Full incident report has been generated successfully",
      })

      // Create a download link for the report
      const reportData = {
        incident: incident,
        timestamp: new Date().toISOString(),
        generatedBy: currentUser?.name || "Admin",
      }

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `incident-report-${incident.id}.json`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }, 2000)
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

  if (!currentUser) {
    // Show loading state instead of immediately redirecting
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.push("/admin/incidents")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Incidents
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </Button>
                <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
                  <Download className="mr-2 h-4 w-4" />
                  {isGeneratingReport ? "Generating..." : "Download Report"}
                </Button>
              </div>
            </div>

            <div className="bg-white p-6 border rounded-lg shadow-sm print:shadow-none">
              <div className="flex flex-col items-center border-b pb-6 mb-6 text-center">
                <div className="bg-red-100 text-red-800 p-2 rounded-full mb-2">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold mb-1">FULL INCIDENT REPORT</h1>
                <p className="text-muted-foreground">Reference ID: {incident.id}</p>
                <div className="mt-2">{getStatusBadge(incident.status)}</div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-lg font-bold mb-4 border-b pb-2">Incident Information</h2>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="font-medium">Type:</div>
                      <div className="col-span-2">{incident.type}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="font-medium">Location:</div>
                      <div className="col-span-2">{incident.location}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="font-medium">Date & Time:</div>
                      <div className="col-span-2">{new Date(incident.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="font-medium">Status:</div>
                      <div className="col-span-2">{incident.status}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="font-medium">Reported By:</div>
                      <div className="col-span-2">{incident.reportedBy}</div>
                    </div>
                    {incident.coordinates && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium">GPS Coordinates:</div>
                        <div className="col-span-2">
                          {incident.coordinates.lat}, {incident.coordinates.lng}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold mb-4 border-b pb-2">Response Details</h2>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="font-medium">Initial Response:</div>
                      <div className="col-span-2">Within 5 minutes</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="font-medium">Response Team:</div>
                      <div className="col-span-2">Campus Security</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="font-medium">External Agencies:</div>
                      <div className="col-span-2">None required</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="font-medium">First Responder:</div>
                      <div className="col-span-2">Officer Adi</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="font-medium">Resolution Time:</div>
                      <div className="col-span-2">{incident.status === "resolved" ? "45 minutes" : "Ongoing"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">Incident Details</h2>
                <p className="p-4 bg-gray-50 rounded-md">{incident.details}</p>
              </div>

              {incident.media && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold mb-4 border-b pb-2">Evidence & Media</h2>
                  <div className="border rounded-md p-4">
                    {incident.media.type === "video" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Video className="h-5 w-5 text-primary" />
                          <span className="font-medium">Video Recording</span>
                        </div>
                        <video src={incident.media.url} controls className="w-full rounded-md max-h-[300px]" />
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
                          className="w-full rounded-md max-h-[300px] object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">Location</h2>
                {incident.coordinates ? (
                  <div className="bg-gray-100 h-[300px] rounded-md flex flex-col items-center justify-center">
                    <div className="mb-4 text-center">
                      <p className="font-medium">Incident Location</p>
                      <p className="text-sm text-muted-foreground">{incident.location}</p>
                      <p className="text-xs text-muted-foreground">
                        Coordinates: {incident.coordinates.lat.toFixed(6)}, {incident.coordinates.lng.toFixed(6)}
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
                ) : (
                  <div className="bg-gray-100 h-[300px] rounded-md flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No location data available for this incident</p>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">Activity Timeline</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-primary/10 rounded-full p-2">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="h-full w-0.5 bg-gray-200 my-1"></div>
                    </div>
                    <div>
                      <p className="font-medium">Incident Reported</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(incident.timestamp).toLocaleTimeString()} - {incident.reportedBy} reported a{" "}
                        {incident.type} at {incident.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-primary/10 rounded-full p-2">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div className="h-full w-0.5 bg-gray-200 my-1"></div>
                    </div>
                    <div>
                      <p className="font-medium">Security Notified</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(new Date(incident.timestamp).getTime() + 2 * 60000).toLocaleTimeString()} - Campus
                        security was notified and dispatched to the location
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-primary/10 rounded-full p-2">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      {incident.status !== "new" && <div className="h-full w-0.5 bg-gray-200 my-1"></div>}
                    </div>
                    <div>
                      <p className="font-medium">Status Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(new Date(incident.timestamp).getTime() + 5 * 60000).toLocaleTimeString()} - Status
                        changed to "In Progress"
                      </p>
                    </div>
                  </div>
                  {incident.status === "resolved" && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="bg-green-100 rounded-full p-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Incident Resolved</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(new Date(incident.timestamp).getTime() + 45 * 60000).toLocaleTimeString()} -
                          Incident was successfully resolved
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-4 border-b pb-2">Additional Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="font-medium">Campus Alerts Issued:</p>
                    <p>Yes - Localized alert to affected building</p>

                    <p className="font-medium mt-4">Evacuation Required:</p>
                    <p>No</p>

                    <p className="font-medium mt-4">Property Damage:</p>
                    <p>None reported</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Follow-up Required:</p>
                    <p>{incident.status === "resolved" ? "No" : "Yes - Monitoring situation"}</p>

                    <p className="font-medium mt-4">Witness Statements:</p>
                    <p>2 statements collected</p>

                    <p className="font-medium mt-4">Report Generated:</p>
                    <p>{new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  This report is confidential and intended for authorized personnel only. UniSafe
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

