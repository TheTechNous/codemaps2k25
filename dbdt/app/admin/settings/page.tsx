"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Lock, Moon, Shield } from "lucide-react"

export default function AdminSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser } = useStore()

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true)
  const [isAutoAssignEnabled, setIsAutoAssignEnabled] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/admin/login")
    } else if (currentUser.role !== "admin") {
      router.push("/")
    }

    // Check system theme preference
    const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(isDark)
  }, [currentUser, router])

  const handleSaveSettings = () => {
    setIsSaving(true)

    // Update theme when settings are saved
    document.documentElement.classList.toggle("dark", isDarkMode)

    // Simulate saving settings
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully",
      })
    }, 1000)
  }

  // Handle dark mode toggle
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
      <AdminHeader />
      <SidebarBackdrop />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">Manage your admin panel preferences and account settings</p>
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
                    <Label htmlFor="personnel-updates">Personnel updates</Label>
                    <Switch id="personnel-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="system-notifications">System notifications</Label>
                    <Switch id="system-notifications" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Configure security and incident response settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="auto-assign">Auto-assign personnel</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically assign available personnel to new incidents
                      </p>
                    </div>
                    <Switch id="auto-assign" checked={isAutoAssignEnabled} onCheckedChange={setIsAutoAssignEnabled} />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="geofencing-alerts">Geofencing alerts</Label>
                    <Switch id="geofencing-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="incident-escalation">Automatic incident escalation</Label>
                    <Switch id="incident-escalation" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Account Security
                  </CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="two-factor">Two-factor authentication</Label>
                    <Switch id="two-factor" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="session-timeout">Session timeout (30 minutes)</Label>
                    <Switch id="session-timeout" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="activity-log">Activity logging</Label>
                    <Switch id="activity-log" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-primary" />
                    Appearance
                  </CardTitle>
                  <CardDescription>Customize the appearance of the admin panel</CardDescription>
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

