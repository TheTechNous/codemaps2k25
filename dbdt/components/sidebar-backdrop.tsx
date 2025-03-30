"use client"

import { useSidebar } from "./sidebar-context"

export function SidebarBackdrop() {
  const { isOpen, close } = useSidebar()

  if (!isOpen) return null

  return <div className="fixed inset-0 z-[5] bg-black/50 md:hidden" onClick={close} aria-hidden="true" />
}

