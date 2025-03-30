"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, LogOut, Menu, Settings, Shield, User } from "lucide-react"
import { useStore } from "@/lib/store"
import { NotificationIndicator } from "@/components/notification-indicator"
import { useSidebar } from "@/components/sidebar-context"

export function AdminHeader() {
  const router = useRouter()
  const { currentUser, setCurrentUser, notifications } = useStore()
  const { toggle } = useSidebar()

  const handleLogout = () => {
    setCurrentUser(null)
    router.push("/")
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4 md:hidden">
        <Button variant="outline" size="icon" className="shrink-0 md:hidden" onClick={toggle}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <span className="text-lg font-bold">Security Admin</span>
        </Link>
      </div>
      <div className="hidden items-center gap-4 md:flex">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <span className="text-lg font-bold">Security Admin</span>
        </Link>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <NotificationIndicator count={unreadCount}>
          <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/admin/notifications")}>
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </NotificationIndicator>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{currentUser?.name || "Admin Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

