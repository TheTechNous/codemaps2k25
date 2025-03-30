import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { StoreProvider } from "@/lib/store"
import { cn } from "@/lib/utils"
import "./globals.css"
import { SidebarProvider } from "@/components/sidebar-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "UniSafe",
  description: "A real-time emergency alert system for campus safety",
  generator: "Notclair",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <StoreProvider>
            <SidebarProvider>
              {children}
              <Toaster />
            </SidebarProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"

import "./globals.css"

import "./globals.css"

import "./globals.css"

import "./globals.css"



import './globals.css'