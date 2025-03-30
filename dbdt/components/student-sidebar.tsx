"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, FileText, Home, LifeBuoy, MapPin, Phone, Settings, User } from "lucide-react"
import { useStore } from "@/lib/store"
import { useSidebar } from "@/components/sidebar-context"

export function StudentSidebar() {
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
              onClick={() => router.push("/student/dashboard")}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/student/profile")}
            >
              <User className="h-4 w-4" />
              My Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/student/emergency-contacts")}
            >
              <Phone className="h-4 w-4" />
              Emergency Contacts
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/student/notifications")}
            >
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/student/campus-map")}
            >
              <MapPin className="h-4 w-4" />
              Campus Map
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/student/safety-resources")}
            >
              <FileText className="h-4 w-4" />
              Safety Resources
            </Button>
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <nav className="grid items-start gap-2 px-2 text-sm font-medium">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/student/settings")}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => router.push("/student/help")}>
              <LifeBuoy className="h-4 w-4" />
              Help & Support
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
}

