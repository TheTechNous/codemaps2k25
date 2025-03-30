"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StudentHeader } from "@/components/student-header"
import { StudentSidebar } from "@/components/student-sidebar"
import { formatDistanceToNow } from "date-fns"
import { Bell, Check, Info, AlertTriangle, CheckCheck } from "lucide-react"
import { useStore } from "@/lib/store"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"

export default function NotificationsPage() {
  const router = useRouter()
  const { currentUser, notifications, markNotificationAsRead, clearAllNotifications } = useStore()

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/student/login")
    } else if (currentUser.role !== "student") {
      router.push("/")
    }
  }, [currentUser, router])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "success":
        return <Check className="h-5 w-5 text-green-500" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground">Stay updated on important campus safety information</p>
              </div>
              {notifications.length > 0 && (
                <Button variant="outline" onClick={clearAllNotifications}>
                  <CheckCheck className="mr-2 h-4 w-4" /> Mark All as Read
                </Button>
              )}
            </div>

            <div className="grid gap-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Card key={notification.id} className={notification.read ? "bg-muted/40" : ""}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium ${notification.read ? "" : "font-bold"}`}>
                              {notification.title}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <Button variant="ghost" size="sm" onClick={() => markNotificationAsRead(notification.id)}>
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">You have no notifications</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

