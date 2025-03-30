"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, Eye, FileBarChart, FileText, Home, LifeBuoy, MapPin, Settings, Shield, Users } from "lucide-react"
import { useStore } from "@/lib/store"
import { useSidebar } from "@/components/sidebar-context"

export function AdminSidebar() {
  const router = useRouter()
  const { currentUser } = useStore()
  const { isOpen } = useSidebar()

  if (!currentUser) {
    return null
  }

  return (
    <div
      className={`${isOpen ? "block" : "hidden"} fixed inset-y-0 left-0 z-10 w-64 transform transition-transform duration-300 ease-in-out md:relative md:block md:translate-x-0 border-r bg-muted/40`}
    >
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/admin/dashboard")}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/admin/incidents")}
            >
              <Shield className="h-4 w-4" />
              Incidents
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/admin/personnel")}
            >
              <Users className="h-4 w-4" />
              Security Personnel
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/admin/geofencing")}
            >
              <MapPin className="h-4 w-4" />
              Geofencing
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/admin/surveillance")}
            >
              <Eye className="h-4 w-4" />
              Student Surveillance
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/admin/reports")}
            >
              <FileBarChart className="h-4 w-4" />
              Reports
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/admin/notifications")}
            >
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/admin/resources")}
            >
              <FileText className="h-4 w-4" />
              Resources
            </Button>
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <nav className="grid items-start gap-2 px-2 text-sm font-medium">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/admin/settings")}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => router.push("/admin/help")}>
              <LifeBuoy className="h-4 w-4" />
              Help & Support
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
}

