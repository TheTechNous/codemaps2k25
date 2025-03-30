"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { IncidentTable } from "@/components/incident-table"
import { IncidentMap } from "@/components/incident-map"
import { Activity, AlertTriangle, CheckCircle, Clock, FileBarChart, Users, MapPin, Bell, BarChart } from "lucide-react"
import { useStore } from "@/lib/store"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"

export default function AdminDashboard() {
  const router = useRouter()
  const { currentUser, emergencies, updateEmergencyStatus } = useStore()
  const [showHeatmap, setShowHeatmap] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/admin/login")
    } else if (currentUser.role !== "admin") {
      router.push("/")
    }
  }, [currentUser, router])

  const newIncidents = emergencies.filter((i) => i.status === "new").length
  const inProgressIncidents = emergencies.filter((i) => i.status === "in-progress").length
  const resolvedIncidents = emergencies.filter((i) => i.status === "resolved").length

  if (!currentUser) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <SidebarBackdrop />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Security Admin Dashboard</h1>
              <p className="text-muted-foreground">Monitor and respond to campus emergencies</p>
            </div>

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
                  <p className="text-xs text-muted-foreground">Completed in the last 24 hours</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Security Personnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">12</div>
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Users className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Active on campus</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="incidents" className="space-y-4">
              <TabsList>
                <TabsTrigger value="incidents">Incident List</TabsTrigger>
                <TabsTrigger value="map">Live Map</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="incidents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Incidents</CardTitle>
                    <CardDescription>View and manage all reported emergencies across campus</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <IncidentTable incidents={emergencies} updateStatus={updateEmergencyStatus} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="map" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Campus Emergency Map</CardTitle>
                      <CardDescription>View incident locations across campus in real-time</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => setShowHeatmap(!showHeatmap)}
                    >
                      {showHeatmap ? <MapPin className="h-4 w-4" /> : <BarChart className="h-4 w-4" />}
                      {showHeatmap ? "Standard View" : "Heatmap View"}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[500px] w-full">
                      <IncidentMap incidents={emergencies} showHeatmap={showHeatmap} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Analytics</CardTitle>
                    <CardDescription>View trends and statistics for campus emergencies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <FileBarChart className="h-10 w-10 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                        <p className="text-sm text-muted-foreground">
                          Detailed analytics and reporting features would be displayed here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>System activity and security team actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emergencies.slice(0, 4).map((incident, index) => (
                      <div key={incident.id} className="flex items-start gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Activity className="h-4 w-4" />
                        </div>
                        <div className="grid gap-1">
                          <p className="text-sm font-medium">
                            {index === 0
                              ? `New incident reported: ${incident.type} at ${incident.location}`
                              : index === 1
                                ? `Officer Naval responded to incident ${incident.id}`
                                : index === 2
                                  ? `Incident ${incident.id} marked as ${incident.status}`
                                  : `Security team deployed to ${incident.location}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {index === 0
                              ? "Just now"
                              : index === 1
                                ? "10 minutes ago"
                                : index === 2
                                  ? "45 minutes ago"
                                  : "1 hour ago"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => router.push("/admin/personnel")}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Manage Security Personnel
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => router.push("/admin/geofencing")}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Update Geofencing Zones
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => router.push("/admin/reports")}
                    >
                      <FileBarChart className="mr-2 h-4 w-4" />
                      Generate Safety Report
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => router.push("/admin/notifications")}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Configure Alert Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

