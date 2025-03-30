"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { StudentHeader } from "@/components/student-header"
import { StudentSidebar } from "@/components/student-sidebar"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Lock, MapPin, Moon, Shield } from "lucide-react"

export default function StudentSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser, locationSharingEnabled, setLocationSharingEnabled } = useStore()

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true)
  const [isEmergencyContactsEnabled, setIsEmergencyContactsEnabled] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/student/login")
    } else if (currentUser.role !== "student") {
      router.push("/")
    }

    // Remove the automatic dark mode application
    // Check system theme preference
    const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(isDark)

    // Don't automatically apply theme here
    // document.documentElement.classList.toggle("dark", isDark)
  }, [currentUser, router])

  const handleSaveSettings = () => {
    setIsSaving(true)

    // Update theme when settings are saved
    document.documentElement.classList.toggle("dark", isDarkMode)

    // Update location sharing in store
    setLocationSharingEnabled(locationSharingEnabled)

    // Simulate saving settings
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully",
      })
    }, 1000)
  }

  // Add a new function to handle dark mode toggle
  const handleDarkModeToggle = (enabled: boolean) => {
    setIsDarkMode(enabled)
    // Apply the theme change immediately for better user experience
    document.documentElement.classList.toggle("dark", enabled)
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
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">Manage your application preferences and account settings</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Configure how you receive notifications and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="notifications-enabled">Enable notifications</Label>
                    <Switch
                      id="notifications-enabled"
                      checked={isNotificationsEnabled}
                      onCheckedChange={setIsNotificationsEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="emergency-alerts">Emergency alerts</Label>
                    <Switch id="emergency-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="safety-updates">Safety updates</Label>
                    <Switch id="safety-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="campus-news">Campus news</Label>
                    <Switch id="campus-news" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location Services
                  </CardTitle>
                  <CardDescription>Manage location sharing and tracking preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="location-sharing">Location sharing</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow the app to access your location during emergencies
                      </p>
                    </div>
                    <Switch
                      id="location-sharing"
                      checked={locationSharingEnabled}
                      onCheckedChange={setLocationSharingEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="emergency-contacts">Emergency contacts access</Label>
                      <p className="text-xs text-muted-foreground">
                        Share your location with emergency contacts during alerts
                      </p>
                    </div>
                    <Switch
                      id="emergency-contacts"
                      checked={isEmergencyContactsEnabled}
                      onCheckedChange={setIsEmergencyContactsEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="location-history">Location history</Label>
                    <Switch id="location-history" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>Manage your privacy and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="two-factor">Two-factor authentication</Label>
                    <Switch id="two-factor" />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="data-collection">Data collection and usage</Label>
                    <Switch id="data-collection" defaultChecked />
                  </div>
                  <Button variant="outline" className="w-full mt-2" onClick={() => router.push("/student/profile")}>
                    <Shield className="mr-2 h-4 w-4" />
                    Manage Account Security
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-primary" />
                    Appearance
                  </CardTitle>
                  <CardDescription>Customize the appearance of the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="dark-mode">Dark mode</Label>
                      <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
                    </div>
                    <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={handleDarkModeToggle} />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="compact-view">Compact view</Label>
                    <Switch id="compact-view" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

