"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

// Types
export type EmergencyStatus = "new" | "in-progress" | "resolved"

export interface Emergency {
  id: string
  type: string
  details: string
  status: EmergencyStatus
  timestamp: string
  location: string
  reportedBy: string
  coordinates?: { lat: number; lng: number }
  media?: {
    type: "video" | "audio" | "image"
    url: string
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: "student" | "admin"
  profileImage?: string
}

export interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  email: string
  notifyOnEmergency: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: "emergency" | "info" | "warning" | "success"
}

interface StoreContextType {
  // User
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  registerUser: (userData: Omit<User, "id">) => Promise<User>

  // Emergencies
  emergencies: Emergency[]
  addEmergency: (emergency: Omit<Emergency, "id" | "timestamp" | "status" | "reportedBy">) => void
  updateEmergencyStatus: (id: string, status: EmergencyStatus) => void

  // Emergency Contacts
  emergencyContacts: EmergencyContact[]
  addEmergencyContact: (contact: Omit<EmergencyContact, "id">) => void
  updateEmergencyContact: (id: string, contact: Partial<EmergencyContact>) => void
  deleteEmergencyContact: (id: string) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markNotificationAsRead: (id: string) => void
  clearAllNotifications: () => void

  // Settings
  locationSharingEnabled: boolean
  setLocationSharingEnabled: (enabled: boolean) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

// Mock data
const mockUsers: User[] = [
  {
    id: "user1",
    name: "Nakul sharma",
    email: "NakulSharma@university.edu",
    role: "student",
  },
  {
    id: "user2",
    name: "Admin Security",
    email: "admin@university.edu",
    role: "admin",
  },
]

const mockEmergencies: Emergency[] = [
  {
    id: "INC-1001",
    type: "Medical Emergency",
    details: "Student feeling dizzy and having trouble breathing",
    location: "Ai-Block, Room LH-101",
    reportedBy: "Nakul Sharma",
    timestamp: "2025-06-10T14:30:00",
    status: "new",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: "INC-1002",
    type: "Harassment",
    details: "Verbal harassment by unknown individual",
    location: "C-Block, Near Cafeteria",
    reportedBy: "Anshika Gupta",
    timestamp: "2025-06-10T15:45:00",
    status: "in-progress",
    coordinates: { lat: 40.7138, lng: -74.008 },
  },
  {
    id: "INC-1003",
    type: "Fire Alarm",
    details: "Smoke detected in kitchen area",
    location: "Bawarchi-cafe",
    reportedBy: "Himnish Sharma",
    timestamp: "2025-06-10T16:15:00",
    status: "resolved",
    coordinates: { lat: 40.7148, lng: -74.005 },
  },
  {
    id: "INC-1004",
    type: "Security Threat",
    details: "Suspicious individual loitering near entrance",
    location: "Library, 4th Floor",
    reportedBy: "Kunal",
    timestamp: "2025-06-10T16:30:00",
    status: "new",
    coordinates: { lat: 40.7135, lng: -74.009 },
  },
]

const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: "contact1",
    name: "Mom",
    relationship: "Parent",
    phone: "555-123-4567",
    email: "mom@example.com",
    notifyOnEmergency: true,
  },
  {
    id: "contact2",
    name: "Brother",
    relationship: "Sibling",
    phone: "555-987-6543",
    email: "Brother@example.com",
    notifyOnEmergency: true,
  },
  {
    id: "contact3",
    name: "Aditya",
    relationship: "Friend",
    phone: "555-555-5555",
    email: "Aditya@example.com",
    notifyOnEmergency: false,
  },
]

const mockNotifications: Notification[] = [
  {
    id: "notif1",
    title: "Emergency Alert",
    message: "Your emergency alert has been received. Security personnel have been dispatched.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    read: false,
    type: "emergency",
  },
  {
    id: "notif2",
    title: "Campus Alert",
    message: "Scheduled fire drill tomorrow at 10:00 AM in all campus buildings.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: true,
    type: "info",
  },
]

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // State
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [emergencies, setEmergencies] = useState<Emergency[]>(mockEmergencies)
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(mockEmergencyContacts)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [locationSharingEnabled, setLocationSharingEnabled] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
    } else {
      localStorage.removeItem("currentUser")
    }
  }, [currentUser])

  // Emergency functions
  const addEmergency = (emergency: Omit<Emergency, "id" | "timestamp" | "status" | "reportedBy">) => {
    const newEmergency: Emergency = {
      ...emergency,
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      status: "new",
      reportedBy: currentUser?.name || "Anonymous",
    }

    setEmergencies((prev) => [newEmergency, ...prev])

    // Add notification for admin
    addNotification({
      title: "New Emergency Alert",
      message: `New ${emergency.type} reported at ${emergency.location}`,
      type: "emergency",
    })
  }

  const updateEmergencyStatus = (id: string, status: EmergencyStatus) => {
    setEmergencies((prev) => prev.map((emergency) => (emergency.id === id ? { ...emergency, status } : emergency)))

    // Add notification about status change
    const emergency = emergencies.find((e) => e.id === id)
    if (emergency) {
      addNotification({
        title: "Emergency Status Updated",
        message: `Incident ${id} is now ${status}`,
        type: status === "resolved" ? "success" : "warning",
      })
    }
  }

  // Emergency Contact functions
  const addEmergencyContact = (contact: Omit<EmergencyContact, "id">) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: `contact${Date.now()}`,
    }
    setEmergencyContacts((prev) => [...prev, newContact])
  }

  const updateEmergencyContact = (id: string, contact: Partial<EmergencyContact>) => {
    setEmergencyContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...contact } : c)))
  }

  const deleteEmergencyContact = (id: string) => {
    setEmergencyContacts((prev) => prev.filter((c) => c.id !== id))
  }

  // Notification functions
  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const registerUser = async (userData: Omit<User, "id">): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if email already exists
        const emailExists = mockUsers.some((user) => user.email === userData.email)
        if (emailExists) {
          reject(new Error("Email already in use. Please use a different email address."))
          return
        }

        // Create new user
        const newUser: User = {
          id: `user${mockUsers.length + 1}`,
          ...userData,
        }

        // In a real app, we would save this to a database
        mockUsers.push(newUser)

        resolve(newUser)
      }, 1000)
    })
  }

  // Expose the store
  const value = {
    currentUser,
    setCurrentUser,
    registerUser,
    emergencies,
    addEmergency,
    updateEmergencyStatus,
    emergencyContacts,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    notifications,
    addNotification,
    markNotificationAsRead,
    clearAllNotifications,
    locationSharingEnabled,
    setLocationSharingEnabled,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

// Helper function to simulate login
export function loginUser(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email)
      if (user) {
        resolve(user)
      } else {
        reject(new Error("Invalid email or password"))
      }
    }, 1000)
  })
}

