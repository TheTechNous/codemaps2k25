"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentHeader } from "@/components/student-header"
import { StudentSidebar } from "@/components/student-sidebar"
import { Badge } from "@/components/ui/badge"
import { CampusMap } from "@/components/campus-map"
import { useStore } from "@/lib/store"
import { Building, MapPin, Navigation, Shield } from "lucide-react"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"

export default function CampusMapPage() {
  const router = useRouter()
  const { currentUser, emergencies } = useStore()
  const [activeTab, setActiveTab] = useState("map")
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/student/login")
    } else if (currentUser.role !== "student") {
      router.push("/")
    }
  }, [currentUser, router])

  // Sample campus buildings data
  const buildings = [
    { id: "lib", name: "Library", type: "academic", emergencyExits: 4, securityPersonnel: 2 },
    { id: "sci", name: "Ai Block", type: "academic", emergencyExits: 6, securityPersonnel: 3 },
    { id: "admin", name: "A-Block", type: "administrative", emergencyExits: 3, securityPersonnel: 4 },
    { id: "dorm-a", name: "B-Block", type: "residential", emergencyExits: 8, securityPersonnel: 2 },
    { id: "dorm-b", name: "C-Block", type: "residential", emergencyExits: 8, securityPersonnel: 2 },
    { id: "gym", name: "Milkha Singh Sports Complex", type: "recreational", emergencyExits: 6, securityPersonnel: 2 },
    { id: "cafe", name: "G-Block", type: "recreational", emergencyExits: 4, securityPersonnel: 1 },
    { id: "park", name: "E & H-Block", type: "outdoor", emergencyExits: 0, securityPersonnel: 1 },
  ]

  // Filter active emergencies
  const activeEmergencies = emergencies.filter((e) => e.status !== "resolved")

  if (!currentUser) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <StudentHeader />
      <SidebarBackdrop />
      <div className="flex flex-1">
        <StudentSidebar />
        <main className="flex-1 p-6">
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Campus Map</h1>
              <p className="text-muted-foreground">
                Navigate campus, find emergency exits, and view security information
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
                <TabsTrigger value="map">Interactive Map</TabsTrigger>
                <TabsTrigger value="buildings">Buildings</TabsTrigger>
                <TabsTrigger value="emergency">Emergency Points</TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="mt-6">
                <Card className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle>Campus Interactive Map</CardTitle>
                    <CardDescription>
                      Navigate the campus map to find buildings, emergency exits, and security stations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative h-[600px] w-full">
                      <CampusMap
                        buildings={buildings}
                        emergencies={activeEmergencies}
                        selectedBuilding={selectedBuilding}
                        onSelectBuilding={setSelectedBuilding}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="buildings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Campus Buildings</CardTitle>
                    <CardDescription>Information about campus buildings and facilities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {buildings.map((building) => (
                        <Card
                          key={building.id}
                          className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedBuilding === building.id ? "border-primary" : ""
                          }`}
                          onClick={() => {
                            setSelectedBuilding(building.id)
                            setActiveTab("map")
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{building.name}</h3>
                                <Badge variant="outline" className="mt-1">
                                  {building.type}
                                </Badge>
                                <div className="mt-2 space-y-1 text-sm">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3" />
                                    <span>{building.emergencyExits} emergency exits</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-3 w-3" />
                                    <span>{building.securityPersonnel} security personnel</span>
                                  </div>
                                </div>
                              </div>
                              <Building className="h-8 w-8 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="emergency" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Points</CardTitle>
                    <CardDescription>
                      Locations of emergency phones, first aid stations, and AED devices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Emergency Phones</h3>
                              <p className="text-sm text-muted-foreground">
                                Direct line to campus security available 24/7
                              </p>
                            </div>
                            <Badge>12 Locations</Badge>
                          </div>
                          <Button
                            variant="outline"
                            className="mt-4 w-full"
                            onClick={() => {
                              setActiveTab("map")
                              // In a real app, this would highlight emergency phones on the map
                            }}
                          >
                            <Navigation className="mr-2 h-4 w-4" />
                            Show on Map
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">First Aid Stations</h3>
                              <p className="text-sm text-muted-foreground">Medical supplies for minor injuries</p>
                            </div>
                            <Badge>8 Locations</Badge>
                          </div>
                          <Button
                            variant="outline"
                            className="mt-4 w-full"
                            onClick={() => {
                              setActiveTab("map")
                              // In a real app, this would highlight first aid stations on the map
                            }}
                          >
                            <Navigation className="mr-2 h-4 w-4" />
                            Show on Map
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">AED Devices</h3>
                              <p className="text-sm text-muted-foreground">
                                Automated External Defibrillators for cardiac emergencies
                              </p>
                            </div>
                            <Badge>6 Locations</Badge>
                          </div>
                          <Button
                            variant="outline"
                            className="mt-4 w-full"
                            onClick={() => {
                              setActiveTab("map")
                              // In a real app, this would highlight AED devices on the map
                            }}
                          >
                            <Navigation className="mr-2 h-4 w-4" />
                            Show on Map
                          </Button>
                        </CardContent>
                      </Card>
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

