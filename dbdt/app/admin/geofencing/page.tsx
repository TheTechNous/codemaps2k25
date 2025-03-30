"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Badge } from "@/components/ui/badge"
import { GeofencingMap } from "@/components/geofencing-map"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Plus, Trash, AlertTriangle, Shield } from "lucide-react"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"

// Sample geofencing zones data
const initialZones = [
  {
    id: "zone1",
    name: "Shoolini Campus",
    type: "safe",
    status: "active",
    description: "Central campus area including academic buildings and quad",
    coordinates: [
      { lat: 40.7128, lng: -74.006 },
      { lat: 40.7138, lng: -74.006 },
      { lat: 40.7138, lng: -74.005 },
      { lat: 40.7128, lng: -74.005 },
    ],
    alertLevel: "low",
    restrictions: ["none"],
    createdAt: "2025-01-15T12:00:00Z",
  },
  {
    id: "zone2",
    name: "OAT Area",
    type: "restricted",
    status: "active",
    description: "Student housing area with controlled access",
    coordinates: [
      { lat: 40.714, lng: -74.008 },
      { lat: 40.715, lng: -74.008 },
      { lat: 40.715, lng: -74.007 },
      { lat: 40.714, lng: -74.007 },
    ],
    alertLevel: "medium",
    restrictions: ["visitor-approval", "after-hours-access"],
    createdAt: "2025-02-10T14:30:00Z",
  },
  {
    id: "zone3",
    name: "Hostel Area",
    type: "high-security",
    status: "active",
    description: "Sensitive research facilities with strict access control",
    coordinates: [
      { lat: 40.7135, lng: -74.009 },
      { lat: 40.7145, lng: -74.009 },
      { lat: 40.7145, lng: -74.008 },
      { lat: 40.7135, lng: -74.008 },
    ],
    alertLevel: "high",
    restrictions: ["authorized-personnel", "id-verification", "escort-required"],
    createdAt: "2025-03-05T09:15:00Z",
  },
  {
    id: "zone4",
    name: "Sports Complex",
    type: "monitored",
    status: "inactive",
    description: "Athletic facilities and fields",
    coordinates: [
      { lat: 40.712, lng: -74.004 },
      { lat: 40.713, lng: -74.004 },
      { lat: 40.713, lng: -74.003 },
      { lat: 40.712, lng: -74.003 },
    ],
    alertLevel: "low",
    restrictions: ["scheduled-access"],
    createdAt: "2025-04-20T16:45:00Z",
  },
]

export default function GeofencingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser, emergencies } = useStore()

  const [zones, setZones] = useState(initialZones)
  const [selectedZone, setSelectedZone] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "safe",
    status: "active",
    description: "",
    alertLevel: "low",
    restrictions: [] as string[],
  })

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/admin/login")
    } else if (currentUser.role !== "admin") {
      router.push("/")
    }
  }, [currentUser, router])

  // Function to check if a point is inside a geofenced zone
  const isPointInZone = (point: { lat: number; lng: number }, zone: any) => {
    // This is a simplified implementation - in a real app, you would use proper geospatial calculations
    // For demo purposes, we'll just check if the point is within a simple bounding box
    const zoneCoords = zone.coordinates

    if (!zoneCoords || zoneCoords.length < 3) return false

    // Calculate bounding box
    const lats = zoneCoords.map((c) => c.lat)
    const lngs = zoneCoords.map((c) => c.lng)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    // Check if point is in bounding box
    return point.lat >= minLat && point.lat <= maxLat && point.lng >= minLng && point.lng <= maxLng
  }

  // Function to check alerts outside safe zones
  const checkAlertsOutsideSafeZones = () => {
    if (!emergencies || emergencies.length === 0) return []

    return emergencies.filter((emergency) => {
      if (!emergency.coordinates) return false

      // Check if emergency is outside all safe zones
      const safeZones = zones.filter((zone) => zone.type === "safe" && zone.status === "active")
      return !safeZones.some((zone) => isPointInZone(emergency.coordinates, zone))
    })
  }

  const alertsOutsideSafeZones = checkAlertsOutsideSafeZones()

  const resetForm = () => {
    setFormData({
      name: "",
      type: "safe",
      status: "active",
      description: "",
      alertLevel: "low",
      restrictions: [],
    })
  }

  const handleAddZone = () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would draw the zone on the map and get coordinates
    // For this demo, we'll use dummy coordinates
    const newZone = {
      id: `zone${zones.length + 1}`,
      ...formData,
      coordinates: [
        { lat: 40.7125, lng: -74.01 },
        { lat: 40.7135, lng: -74.01 },
        { lat: 40.7135, lng: -74.009 },
        { lat: 40.7125, lng: -74.009 },
      ],
      createdAt: new Date().toISOString(),
    }

    setZones([...zones, newZone])
    setIsAddDialogOpen(false)
    resetForm()

    toast({
      title: "Zone added",
      description: `${newZone.name} geofencing zone has been created`,
    })
  }

  const handleEditZone = () => {
    if (!selectedZone) return

    if (!formData.name || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedZones = zones.map((zone) =>
      zone.id === selectedZone.id
        ? {
            ...zone,
            ...formData,
          }
        : zone,
    )

    setZones(updatedZones)
    setIsEditDialogOpen(false)
    resetForm()

    toast({
      title: "Zone updated",
      description: `${formData.name} geofencing zone has been updated`,
    })
  }

  const handleDeleteZone = () => {
    if (!selectedZone) return

    const updatedZones = zones.filter((zone) => zone.id !== selectedZone.id)
    setZones(updatedZones)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Zone deleted",
      description: `${selectedZone.name} geofencing zone has been deleted`,
    })
  }

  const openEditDialog = (zone: any) => {
    setSelectedZone(zone)
    setFormData({
      name: zone.name,
      type: zone.type,
      status: zone.status,
      description: zone.description,
      alertLevel: zone.alertLevel,
      restrictions: zone.restrictions,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (zone: any) => {
    setSelectedZone(zone)
    setIsDeleteDialogOpen(true)
  }

  const openAlertDialog = (alert: any) => {
    setSelectedAlert(alert)
    setIsAlertDialogOpen(true)
  }

  const getZoneTypeBadge = (type: string) => {
    switch (type) {
      case "safe":
        return <Badge className="bg-green-500">Safe</Badge>
      case "restricted":
        return <Badge className="bg-yellow-500">Restricted</Badge>
      case "high-security":
        return <Badge className="bg-red-500">High Security</Badge>
      case "monitored":
        return <Badge className="bg-blue-500">Monitored</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getZoneStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

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
                <h1 className="text-3xl font-bold tracking-tight">Geofencing</h1>
                <p className="text-muted-foreground">Manage virtual boundaries and security zones</p>
              </div>
              <div className="flex gap-2">
                {alertsOutsideSafeZones.length > 0 && (
                  <Button variant="destructive" onClick={() => openAlertDialog(alertsOutsideSafeZones[0])}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    {alertsOutsideSafeZones.length} Alerts Outside Safe Zones
                  </Button>
                )}
                <Button
                  onClick={() => {
                    resetForm()
                    setIsAddDialogOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Zone
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Zones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{zones.length}</div>
                  <p className="text-xs text-muted-foreground">Defined geofencing areas</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Zones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{zones.filter((z) => z.status === "active").length}</div>
                  <p className="text-xs text-muted-foreground">Currently enforced</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">High Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{zones.filter((z) => z.alertLevel === "high").length}</div>
                  <p className="text-xs text-muted-foreground">Restricted access areas</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="map" className="space-y-4">
              <TabsList>
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="alerts">Alert Logs</TabsTrigger>
              </TabsList>
              <TabsContent value="map" className="space-y-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle>Geofencing Map</CardTitle>
                    <CardDescription>Visual representation of all geofencing zones</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[600px] w-full">
                      <GeofencingMap
                        zones={zones}
                        selectedZone={selectedZone}
                        onSelectZone={setSelectedZone}
                        emergencies={emergencies}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="list" className="space-y-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle>Geofencing Zones</CardTitle>
                    <CardDescription>List of all defined geofencing zones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {zones.map((zone) => (
                        <Card key={zone.id} className="overflow-hidden">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{zone.name}</CardTitle>
                              {getZoneTypeBadge(zone.type)}
                            </div>
                            <CardDescription>{zone.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status:</span>
                                {getZoneStatusBadge(zone.status)}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Alert Level:</span>
                                <span className="text-sm font-medium">{zone.alertLevel.toUpperCase()}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Restrictions:</span>
                                <span className="text-sm">{zone.restrictions.length}</span>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => openEditDialog(zone)}>
                                <Edit className="mr-1 h-4 w-4" />
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(zone)}>
                                <Trash className="mr-1 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Geofencing Settings</CardTitle>
                    <CardDescription>Configure global geofencing settings and notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Settings</h3>
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="zone-entry">Zone Entry Alerts</Label>
                        <Switch id="zone-entry" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="zone-exit">Zone Exit Alerts</Label>
                        <Switch id="zone-exit" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="restricted-entry">Restricted Zone Violations</Label>
                        <Switch id="restricted-entry" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="after-hours">After Hours Access</Label>
                        <Switch id="after-hours" defaultChecked />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Default Zone Settings</h3>
                      <div className="grid gap-2">
                        <Label htmlFor="default-type">Default Zone Type</Label>
                        <Select defaultValue="monitored">
                          <SelectTrigger id="default-type">
                            <SelectValue placeholder="Select zone type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="safe">Safe</SelectItem>
                            <SelectItem value="monitored">Monitored</SelectItem>
                            <SelectItem value="restricted">Restricted</SelectItem>
                            <SelectItem value="high-security">High Security</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="default-alert">Default Alert Level</Label>
                        <Select defaultValue="low">
                          <SelectTrigger id="default-alert">
                            <SelectValue placeholder="Select alert level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">System Integration</h3>
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="access-control">Access Control System</Label>
                        <Switch id="access-control" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="camera-system">Camera System</Label>
                        <Switch id="camera-system" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="emergency-system">Emergency Response System</Label>
                        <Switch id="emergency-system" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="alerts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Geofencing Alert Logs</CardTitle>
                    <CardDescription>History of alerts triggered by geofencing rules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {alertsOutsideSafeZones.length > 0 ? (
                      <div className="space-y-4">
                        {alertsOutsideSafeZones.map((alert) => (
                          <Card key={alert.id} className="border-l-4 border-l-red-500">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="rounded-full bg-red-100 p-2 text-red-600">
                                  <AlertTriangle className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-medium">{alert.type} - Outside Safe Zone</h3>
                                    <Badge variant="outline" className="bg-red-100 text-red-800">
                                      Critical
                                    </Badge>
                                  </div>
                                  <p className="mt-1 text-sm">{alert.details}</p>
                                  <p className="mt-1 text-sm text-muted-foreground">Location: {alert.location}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Reported by: {alert.reportedBy} • {new Date(alert.timestamp).toLocaleString()}
                                  </p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => openAlertDialog(alert)}>
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                        <div className="flex flex-col items-center gap-2 text-center">
                          <Shield className="h-10 w-10 text-muted-foreground" />
                          <h3 className="text-lg font-medium">No Alerts</h3>
                          <p className="text-sm text-muted-foreground">No geofencing alerts have been triggered</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Add Zone Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Geofencing Zone</DialogTitle>
            <DialogDescription>Create a new geofencing zone on campus</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Zone Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Zone name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Zone Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select zone type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safe">Safe</SelectItem>
                    <SelectItem value="monitored">Monitored</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                    <SelectItem value="high-security">High Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Zone description"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="alertLevel">Alert Level</Label>
              <Select
                value={formData.alertLevel}
                onValueChange={(value) => setFormData({ ...formData, alertLevel: value })}
              >
                <SelectTrigger id="alertLevel">
                  <SelectValue placeholder="Select alert level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Restrictions</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="restriction-visitor"
                  checked={formData.restrictions.includes("visitor-approval")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        restrictions: [...formData.restrictions, "visitor-approval"],
                      })
                    } else {
                      setFormData({
                        ...formData,
                        restrictions: formData.restrictions.filter((r) => r !== "visitor-approval"),
                      })
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="restriction-visitor" className="text-sm">
                  Visitor Approval Required
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="restriction-hours"
                  checked={formData.restrictions.includes("after-hours-access")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        restrictions: [...formData.restrictions, "after-hours-access"],
                      })
                    } else {
                      setFormData({
                        ...formData,
                        restrictions: formData.restrictions.filter((r) => r !== "after-hours-access"),
                      })
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="restriction-hours" className="text-sm">
                  After Hours Access Restrictions
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="restriction-personnel"
                  checked={formData.restrictions.includes("authorized-personnel")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        restrictions: [...formData.restrictions, "authorized-personnel"],
                      })
                    } else {
                      setFormData({
                        ...formData,
                        restrictions: formData.restrictions.filter((r) => r !== "authorized-personnel"),
                      })
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="restriction-personnel" className="text-sm">
                  Authorized Personnel Only
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddZone}>Add Zone</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Zone Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Geofencing Zone</DialogTitle>
            <DialogDescription>Update geofencing zone details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Zone Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Zone name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Zone Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Select zone type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safe">Safe</SelectItem>
                    <SelectItem value="monitored">Monitored</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                    <SelectItem value="high-security">High Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Zone description"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-alertLevel">Alert Level</Label>
              <Select
                value={formData.alertLevel}
                onValueChange={(value) => setFormData({ ...formData, alertLevel: value })}
              >
                <SelectTrigger id="edit-alertLevel">
                  <SelectValue placeholder="Select alert level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Restrictions</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-restriction-visitor"
                  checked={formData.restrictions.includes("visitor-approval")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        restrictions: [...formData.restrictions, "visitor-approval"],
                      })
                    } else {
                      setFormData({
                        ...formData,
                        restrictions: formData.restrictions.filter((r) => r !== "visitor-approval"),
                      })
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-restriction-visitor" className="text-sm">
                  Visitor Approval Required
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-restriction-hours"
                  checked={formData.restrictions.includes("after-hours-access")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        restrictions: [...formData.restrictions, "after-hours-access"],
                      })
                    } else {
                      setFormData({
                        ...formData,
                        restrictions: formData.restrictions.filter((r) => r !== "after-hours-access"),
                      })
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-restriction-hours" className="text-sm">
                  After Hours Access Restrictions
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-restriction-personnel"
                  checked={formData.restrictions.includes("authorized-personnel")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        restrictions: [...formData.restrictions, "authorized-personnel"],
                      })
                    } else {
                      setFormData({
                        ...formData,
                        restrictions: formData.restrictions.filter((r) => r !== "authorized-personnel"),
                      })
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-restriction-personnel" className="text-sm">
                  Authorized Personnel Only
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditZone}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Zone Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Geofencing Zone</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this geofencing zone? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedZone && (
            <div className="py-4">
              <p className="font-medium">{selectedZone.name}</p>
              <p className="text-sm text-muted-foreground">{selectedZone.description}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteZone}>
              Delete Zone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Details Dialog */}
      <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Alert Outside Safe Zone
            </DialogTitle>
            <DialogDescription>Emergency alert detected outside of designated safe zones</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 font-medium">Type:</div>
                <div className="col-span-2">{selectedAlert.type}</div>

                <div className="col-span-1 font-medium">Location:</div>
                <div className="col-span-2">{selectedAlert.location}</div>

                <div className="col-span-1 font-medium">Reported By:</div>
                <div className="col-span-2">{selectedAlert.reportedBy}</div>

                <div className="col-span-1 font-medium">Time:</div>
                <div className="col-span-2">{new Date(selectedAlert.timestamp).toLocaleString()}</div>

                <div className="col-span-1 font-medium">Status:</div>
                <div className="col-span-2">{selectedAlert.status}</div>

                <div className="col-span-1 font-medium">Details:</div>
                <div className="col-span-2">{selectedAlert.details}</div>
              </div>

              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  <span className="font-medium text-red-800">Security Recommendation</span>
                </div>
                <p className="mt-2 text-sm text-red-700">
                  This emergency is occurring outside of designated safe zones. Immediate security personnel dispatch is
                  recommended.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAlertDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsAlertDialogOpen(false)
                router.push(`/admin/incidents/${selectedAlert?.id}`)
              }}
            >
              View Full Incident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

