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
import { IncidentStats } from "@/components/incident-stats"
import { useStore } from "@/lib/store"
import { Download, Filter, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"

export default function IncidentsPage() {
  const router = useRouter()
  const { currentUser, emergencies, updateEmergencyStatus } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/admin/login")
    } else if (currentUser.role !== "admin") {
      router.push("/")
    }
  }, [currentUser, router])

  // Filter incidents based on search and filters
  const filteredIncidents = emergencies.filter((incident) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.reportedBy.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter

    // Type filter
    const matchesType = typeFilter === "all" || incident.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Get unique incident types for filter
  const incidentTypes = Array.from(new Set(emergencies.map((incident) => incident.type)))

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
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Incidents</h1>
                <p className="text-muted-foreground">Manage and respond to campus emergency incidents</p>
              </div>
              <Button onClick={() => router.push("/admin/incidents/new")}>
                <Plus className="mr-2 h-4 w-4" />
                New Incident
              </Button>
            </div>

            <IncidentStats incidents={emergencies} />

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-1 items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search incidents..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </Button>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Incident Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {incidentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="list" className="space-y-4">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="space-y-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle>Incident List</CardTitle>
                    <CardDescription>
                      {filteredIncidents.length} incident{filteredIncidents.length !== 1 ? "s" : ""} found
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <IncidentTable incidents={filteredIncidents} updateStatus={updateEmergencyStatus} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="map" className="space-y-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle>Incident Map</CardTitle>
                    <CardDescription>Geographic view of all incidents</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[600px] w-full">
                      <IncidentMap incidents={filteredIncidents} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle>Incident Timeline</CardTitle>
                    <CardDescription>Chronological view of incidents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <p className="text-sm text-muted-foreground">
                          Timeline view would display incidents chronologically with status changes and response actions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

