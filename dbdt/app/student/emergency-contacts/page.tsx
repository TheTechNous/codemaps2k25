"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { StudentHeader } from "@/components/student-header"
import { StudentSidebar } from "@/components/student-sidebar"
import { Plus, Trash, Edit } from "lucide-react"
import { useStore, type EmergencyContact } from "@/lib/store"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"

export default function EmergencyContactsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser, emergencyContacts, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact } =
    useStore()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [relationship, setRelationship] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [notifyOnEmergency, setNotifyOnEmergency] = useState(true)

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/student/login")
    } else if (currentUser.role !== "student") {
      router.push("/")
    }
  }, [currentUser, router])

  const resetForm = () => {
    setName("")
    setRelationship("")
    setPhone("")
    setEmail("")
    setNotifyOnEmergency(true)
  }

  const handleAddContact = () => {
    if (!name || !phone) {
      toast({
        title: "Missing information",
        description: "Name and phone number are required",
        variant: "destructive",
      })
      return
    }

    addEmergencyContact({
      name,
      relationship,
      phone,
      email,
      notifyOnEmergency,
    })

    toast({
      title: "Contact added",
      description: `${name} has been added to your emergency contacts`,
    })

    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditContact = () => {
    if (!selectedContact) return

    if (!name || !phone) {
      toast({
        title: "Missing information",
        description: "Name and phone number are required",
        variant: "destructive",
      })
      return
    }

    updateEmergencyContact(selectedContact.id, {
      name,
      relationship,
      phone,
      email,
      notifyOnEmergency,
    })

    toast({
      title: "Contact updated",
      description: `${name}'s information has been updated`,
    })

    resetForm()
    setIsEditDialogOpen(false)
  }

  const handleDeleteContact = () => {
    if (!selectedContact) return

    deleteEmergencyContact(selectedContact.id)

    toast({
      title: "Contact deleted",
      description: `${selectedContact.name} has been removed from your emergency contacts`,
    })

    setIsDeleteDialogOpen(false)
  }

  const openEditDialog = (contact: EmergencyContact) => {
    setSelectedContact(contact)
    setName(contact.name)
    setRelationship(contact.relationship)
    setPhone(contact.phone)
    setEmail(contact.email)
    setNotifyOnEmergency(contact.notifyOnEmergency)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (contact: EmergencyContact) => {
    setSelectedContact(contact)
    setIsDeleteDialogOpen(true)
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
                <h1 className="text-3xl font-bold tracking-tight">Emergency Contacts</h1>
                <p className="text-muted-foreground">Manage people to notify in case of emergency</p>
              </div>
              <Button
                onClick={() => {
                  resetForm()
                  setIsAddDialogOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Contact
              </Button>
            </div>

            <div className="grid gap-4">
              {emergencyContacts.length > 0 ? (
                emergencyContacts.map((contact) => (
                  <Card key={contact.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{contact.name}</h3>
                          <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm">Phone: {contact.phone}</p>
                            {contact.email && <p className="text-sm">Email: {contact.email}</p>}
                          </div>
                          <div className="mt-4 flex items-center">
                            <Switch
                              id={`notify-${contact.id}`}
                              checked={contact.notifyOnEmergency}
                              onCheckedChange={(checked) => {
                                updateEmergencyContact(contact.id, { notifyOnEmergency: checked })
                              }}
                            />
                            <Label htmlFor={`notify-${contact.id}`} className="ml-2">
                              Notify during emergencies
                            </Label>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => openEditDialog(contact)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => openDeleteDialog(contact)}>
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="mb-4 text-muted-foreground">You haven't added any emergency contacts yet</p>
                      <Button
                        onClick={() => {
                          resetForm()
                          setIsAddDialogOpen(true)
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Your First Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Contact Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Emergency Contact</DialogTitle>
            <DialogDescription>Add someone who should be notified in case of an emergency</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="Parent, Sibling, Friend, etc."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="555-123-4567"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="notify" checked={notifyOnEmergency} onCheckedChange={setNotifyOnEmergency} />
              <Label htmlFor="notify">Notify during emergencies</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddContact}>Add Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Emergency Contact</DialogTitle>
            <DialogDescription>Update contact information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-relationship">Relationship</Label>
              <Input
                id="edit-relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="Parent, Sibling, Friend, etc."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone Number *</Label>
              <Input
                id="edit-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="555-123-4567"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="edit-notify" checked={notifyOnEmergency} onCheckedChange={setNotifyOnEmergency} />
              <Label htmlFor="edit-notify">Notify during emergencies</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditContact}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Contact Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Emergency Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="py-4">
              <p className="font-medium">{selectedContact.name}</p>
              <p className="text-sm text-muted-foreground">{selectedContact.phone}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteContact}>
              Delete Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

