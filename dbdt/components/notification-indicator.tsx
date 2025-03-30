import type React from "react"
interface NotificationIndicatorProps {
  count: number
  children: React.ReactNode
}

export function NotificationIndicator({ count, children }: NotificationIndicatorProps) {
  return (
    <div className="relative">
      {children}
      {count > 0 && (
        <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-600">
          {count > 9 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </span>
      )}
    </div>
  )
}

