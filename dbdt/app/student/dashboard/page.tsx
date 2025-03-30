"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle, Bell, ChevronRight, FileText, MapPin, Phone, User, Camera, Mic, Video, X } from "lucide-react"
import { StudentHeader } from "@/components/student-header"
import { StudentSidebar } from "@/components/student-sidebar"
import { EmergencyStatusCard } from "@/components/emergency-status-card"
import { MediaRecorder } from "@/components/media-recorder"
import { useStore } from "@/lib/store"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"

export default function StudentDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser, emergencies, addEmergency, locationSharingEnabled, setLocationSharingEnabled } = useStore()

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [emergencyType, setEmergencyType] = useState("")
  const [emergencyDetails, setEmergencyDetails] = useState("")
  const [locationSharing, setLocationSharing] = useState(locationSharingEnabled)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [showMediaRecorder, setShowMediaRecorder] = useState(false)
  const [mediaRecorderMode, setMediaRecorderMode] = useState<"video" | "audio" | "image">("video")
  const [mediaAttachment, setMediaAttachment] = useState<{
    blob: Blob
    type: "video" | "audio" | "image"
    url: string
  } | null>(null)

  // Add a function to get the user's actual location name
  const [userLocationName, setUserLocationName] = useState("Unknown Location")

  // Add this function to get location name based on coordinates
  const getLocationNameFromCoordinates = async (lat: number, lng: number) => {
    // In a real app, this would use a geocoding service like Google Maps Geocoding API
    // For this demo, we'll use a simple mapping of coordinates to campus locations
    const campusLocations = [
      { lat: 40.712, lng: -74.006, name: "Library Building" },
      { lat: 40.713, lng: -74.007, name: "AI Block, Room 201" },
      { lat: 40.714, lng: -74.008, name: "Student Center" },
      { lat: 40.715, lng: -74.009, name: "Science Building" },
      { lat: 40.716, lng: -74.01, name: "Sports Complex" },
    ]

    // Find the closest location
    let closestLocation = campusLocations[0]
    let minDistance = Number.MAX_VALUE

    campusLocations.forEach((location) => {
      const distance = Math.sqrt(Math.pow(location.lat - lat, 2) + Math.pow(location.lng - lng, 2))

      if (distance < minDistance) {
        minDistance = distance
        closestLocation = location
      }
    })

    return closestLocation.name
  }

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/student/login")
    } else if (currentUser.role !== "student") {
      router.push("/")
    }
  }, [currentUser, router])

  // Update the useEffect that gets user location to also get the location name
  useEffect(() => {
    if (locationSharingEnabled && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserCoordinates(coords)

          // Get location name
          const locationName = await getLocationNameFromCoordinates(coords.lat, coords.lng)
          setUserLocationName(locationName)
        },
        (error) => {
          console.error("Error getting location:", error)
          setUserCoordinates({ lat: 40.7128, lng: -74.006 }) // Default to NYC
          setUserLocationName("Unknown Location")
        },
      )
    }
  }, [locationSharingEnabled])

  // Get user location
  // useEffect(() => {
  //   if (locationSharingEnabled && "geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setUserCoordinates({
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         })
  //       },
  //       (error) => {
  //         console.error("Error getting location:", error)
  //         setUserCoordinates({ lat: 40.7128, lng: -74.006 }) // Default to NYC
  //       },
  //     )
  //   }
  // }, [locationSharingEnabled])

  // Filter emergencies for current user
  const userEmergencies = emergencies.filter((emergency) => currentUser && emergency.reportedBy === currentUser.name)

  const handleEmergencySubmit = async () => {
    if (!emergencyType) {
      toast({
        title: "Error",
        description: "Please select an emergency type",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Create the emergency
    const newEmergency = {
      type: emergencyType,
      details: emergencyDetails,
      location: userLocationName, // Use the actual location name instead of "Current Location"
      coordinates: locationSharing && userCoordinates ? userCoordinates : undefined,
      reportedBy: currentUser?.name || "Unknown User", // Include the current user's name
      media: mediaAttachment
        ? {
            type: mediaAttachment.type,
            url: mediaAttachment.url,
          }
        : undefined,
    }

    try {
      // In a real app, this would be an API call
      addEmergency(newEmergency)

      setIsSubmitting(false)
      setConfirmDialogOpen(false)
      setMediaAttachment(null)

      toast({
        title: "Emergency Alert Sent",
        description: "Security has been notified and will respond shortly.",
        variant: "destructive",
      })

      // Reset form
      setEmergencyType("")
      setEmergencyDetails("")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to send emergency alert. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleMediaCaptured = (mediaBlob: Blob, type: "video" | "audio" | "image") => {
    const url = URL.createObjectURL(mediaBlob)
    setMediaAttachment({
      blob: mediaBlob,
      type,
      url,
    })
    setShowMediaRecorder(false)
  }

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
              <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
              <p className="text-muted-foreground">Report emergencies and track response status</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-full bg-destructive text-destructive-foreground">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <AlertTriangle className="h-12 w-12" />
                    <h2 className="text-2xl font-bold">Emergency Alert</h2>
                    <p className="text-center">
                      Press the button below in case of an emergency situation that requires immediate assistance
                    </p>
                    <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="lg"
                          variant="outline"
                          className="mt-2 h-16 w-full border-2 bg-destructive-foreground text-xl font-bold text-destructive hover:bg-destructive-foreground/90"
                        >
                          PANIC BUTTON
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Confirm Emergency Alert</DialogTitle>
                          <DialogDescription>
                            This will alert campus security immediately. Please provide details about your emergency.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <label htmlFor="emergency-type">Emergency Type</label>
                            <Select value={emergencyType} onValueChange={setEmergencyType}>
                              <SelectTrigger id="emergency-type">
                                <SelectValue placeholder="Select emergency type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
                                <SelectItem value="Fire">Fire</SelectItem>
                                <SelectItem value="Security Threat">Security Threat</SelectItem>
                                <SelectItem value="Harassment">Harassment</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <label htmlFor="details">Details</label>
                            <Textarea
                              id="details"
                              placeholder="Please provide details about your emergency"
                              value={emergencyDetails}
                              onChange={(e) => setEmergencyDetails(e.target.value)}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="location"
                              checked={locationSharing}
                              onChange={(e) => setLocationSharing(e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor="location" className="text-sm">
                              Share my current location
                            </label>
                          </div>

                          {!showMediaRecorder && !mediaAttachment && (
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  setMediaRecorderMode("video")
                                  setShowMediaRecorder(true)
                                }}
                                className="flex-1 min-w-[120px]"
                              >
                                <Video className="h-4 w-4 mr-2" />
                                Record Video
                              </Button>
                              <Button
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  setMediaRecorderMode("audio")
                                  setShowMediaRecorder(true)
                                }}
                                className="flex-1 min-w-[120px]"
                              >
                                <Mic className="h-4 w-4 mr-2" />
                                Record Audio
                              </Button>
                              <Button
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  setMediaRecorderMode("image")
                                  setShowMediaRecorder(true)
                                }}
                                className="flex-1 min-w-[120px]"
                              >
                                <Camera className="h-4 w-4 mr-2" />
                                Take Photo
                              </Button>
                            </div>
                          )}

                          {showMediaRecorder && (
                            <MediaRecorder
                              onMediaCaptured={handleMediaCaptured}
                              onCancel={() => setShowMediaRecorder(false)}
                              initialMode={mediaRecorderMode}
                            />
                          )}

                          {mediaAttachment && (
                            <div className="border rounded-md p-2">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">
                                  {mediaAttachment.type === "video"
                                    ? "Video Attached"
                                    : mediaAttachment.type === "audio"
                                      ? "Audio Attached"
                                      : "Photo Attached"}
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => setMediaAttachment(null)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              {mediaAttachment.type === "video" && (
                                <video
                                  src={mediaAttachment.url}
                                  className="w-full h-32 object-cover rounded-md"
                                  controls
                                />
                              )}
                              {mediaAttachment.type === "audio" && (
                                <audio src={mediaAttachment.url} className="w-full" controls />
                              )}
                              {mediaAttachment.type === "image" && (
                                <img
                                  src={mediaAttachment.url || "/placeholder.svg"}
                                  className="w-full h-32 object-cover rounded-md"
                                  alt="Attached"
                                />
                              )}
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleEmergencySubmit}
                            disabled={isSubmitting || !emergencyType}
                          >
                            {isSubmitting ? "Sending..." : "Send Alert"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Link href="/student/emergency-contacts">
                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="mr-2 h-4 w-4" />
                        Emergency Contacts
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/student/profile">
                      <Button variant="outline" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/student/notifications">
                      <Button variant="outline" className="w-full justify-start">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/student/campus-map">
                      <Button variant="outline" className="w-full justify-start">
                        <MapPin className="mr-2 h-4 w-4" />
                        Campus Map
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/student/safety-resources">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Safety Resources
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Active Emergencies</CardTitle>
                  <CardDescription>Track the status of your reported emergencies</CardDescription>
                </CardHeader>
                <CardContent>
                  {userEmergencies.length > 0 ? (
                    <div className="space-y-4">
                      {userEmergencies.map((emergency) => (
                        <EmergencyStatusCard key={emergency.id} emergency={emergency} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                      <p className="text-sm text-muted-foreground">No active emergencies</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

