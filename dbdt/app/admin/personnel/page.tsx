"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Plus, Search, Trash, User } from "lucide-react"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"

// Sample security personnel data
const initialPersonnel = [
  {
    id: "SP001",
    name: "Naval",
    role: "Security Officer",
    status: "on-duty",
    location: "Main Campus",
    phone: "555-123-4567",
    email: "Naval.Kumar@security.edu",
    shift: "Morning",
    certifications: ["First Aid", "CPR"],
  },
  {
    id: "SP002",
    name: "Aditya",
    role: "Security Supervisor",
    status: "on-duty",
    location: "AI Building",
    phone: "555-123-4568",
    email: "adi@security.edu",
    shift: "Morning",
    certifications: ["First Aid", "CPR", "Self Defense"],
  },
  {
    id: "SP003",
    name: "Shashwat",
    role: "Security Officer",
    status: "off-duty",
    location: "Girls Hostel",
    phone: "555-123-4569",
    email: "Shashwat@security.edu",
    shift: "Evening",
    certifications: ["First Aid"],
  },
  {
    id: "SP004",
    name: "Parth",
    role: "Security Officer",
    status: "on-duty",
    location: "Library",
    phone: "555-123-4570",
    email: "Parth@security.edu",
    shift: "Evening",
    certifications: ["First Aid", "CPR", "Conflict Resolution"],
  },
  {
    id: "SP005",
    name: "Krish",
    role: "Security Supervisor",
    status: "off-duty",
    location: "Administration",
    phone: "555-123-4571",
    email: "Krish@security.edu",
    shift: "Night",
    certifications: ["First Aid", "CPR", "Self Defense", "Emergency Management"],
  },
]

export default function SecurityPersonnelPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser } = useStore()

  const [personnel, setPersonnel] = useState(initialPersonnel)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "Security Officer",
    status: "off-duty",
    location: "",
    phone: "",
    email: "",
    shift: "Morning",
    certifications: [] as string[],
  })

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/admin/login")
    } else if (currentUser.role !== "admin") {
      router.push("/")
    }
  }, [currentUser, router])

  // Filter personnel based on search and filters
  const filteredPersonnel = personnel.filter((person) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.location.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || person.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const resetForm = () => {
    setFormData({
      name: "",
      role: "Security Officer",
      status: "off-duty",
      location: "",
      phone: "",
      email: "",
      shift: "Morning",
      certifications: [],
    })
  }

  const handleAddPerson = () => {
    if (!formData.name || !formData.location || !formData.phone || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newPerson = {
      id: `SP${String(personnel.length + 1).padStart(3, "0")}`,
      ...formData,
    }

    setPersonnel([...personnel, newPerson])
    setIsAddDialogOpen(false)
    resetForm()

    toast({
      title: "Personnel added",
      description: `${newPerson.name} has been added to the security team`,
    })
  }

  const handleEditPerson = () => {
    if (!selectedPerson) return

    if (!formData.name || !formData.location || !formData.phone || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedPersonnel = personnel.map((person) =>
      person.id === selectedPerson.id ? { ...person, ...formData } : person,
    )

    setPersonnel(updatedPersonnel)
    setIsEditDialogOpen(false)
    resetForm()

    toast({
      title: "Personnel updated",
      description: `${formData.name}'s information has been updated`,
    })
  }

  const handleDeletePerson = () => {
    if (!selectedPerson) return

    const updatedPersonnel = personnel.filter((person) => person.id !== selectedPerson.id)
    setPersonnel(updatedPersonnel)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Personnel removed",
      description: `${selectedPerson.name} has been removed from the security team`,
    })
  }

  const openEditDialog = (person: any) => {
    setSelectedPerson(person)
    setFormData({
      name: person.name,
      role: person.role,
      status: person.status,
      location: person.location,
      phone: person.phone,
      email: person.email,
      shift: person.shift,
      certifications: person.certifications,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (person: any) => {
    setSelectedPerson(person)
    setIsDeleteDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-duty":
        return <Badge className="bg-green-500">On Duty</Badge>
      case "off-duty":
        return <Badge variant="outline">Off Duty</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
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
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Security Personnel</h1>
                <p className="text-muted-foreground">Manage security staff and assignments</p>
              </div>
              <Button
                onClick={() => {
                  resetForm()
                  setIsAddDialogOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Personnel
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Personnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{personnel.length}</div>
                  <p className="text-xs text-muted-foreground">Security team members</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">On Duty</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{personnel.filter((p) => p.status === "on-duty").length}</div>
                  <p className="text-xs text-muted-foreground">Currently working</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Off Duty</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{personnel.filter((p) => p.status === "off-duty").length}</div>
                  <p className="text-xs text-muted-foreground">Not currently working</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search personnel..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="on-duty">On Duty</SelectItem>
                  <SelectItem value="off-duty">Off Duty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader className="p-4">
                <CardTitle>Security Team</CardTitle>
                <CardDescription>{filteredPersonnel.length} personnel found</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPersonnel.map((person) => (
                      <TableRow key={person.id}>
                        <TableCell className="font-medium">{person.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder-user.jpg`} alt={person.name} />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            {person.name}
                          </div>
                        </TableCell>
                        <TableCell>{person.role}</TableCell>
                        <TableCell>{person.location}</TableCell>
                        <TableCell>{person.shift}</TableCell>
                        <TableCell>{getStatusBadge(person.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(person)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(person)}>
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Add Personnel Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Security Personnel</DialogTitle>
            <DialogDescription>Add a new member to the security team</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Security Officer">Security Officer</SelectItem>
                    <SelectItem value="Security Supervisor">Security Supervisor</SelectItem>
                    <SelectItem value="Emergency Response">Emergency Response</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="555-123-4567"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Building or area"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shift">Shift</Label>
                <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value })}>
                  <SelectTrigger id="shift">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning (6am-2pm)</SelectItem>
                    <SelectItem value="Evening">Evening (2pm-10pm)</SelectItem>
                    <SelectItem value="Night">Night (10pm-6am)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-duty">On Duty</SelectItem>
                  <SelectItem value="off-duty">Off Duty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPerson}>Add Personnel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Personnel Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Security Personnel</DialogTitle>
            <DialogDescription>Update personnel information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Security Officer">Security Officer</SelectItem>
                    <SelectItem value="Security Supervisor">Security Supervisor</SelectItem>
                    <SelectItem value="Emergency Response">Emergency Response</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone Number *</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="555-123-4567"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location *</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Building or area"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-shift">Shift</Label>
                <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value })}>
                  <SelectTrigger id="edit-shift">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning (6am-2pm)</SelectItem>
                    <SelectItem value="Evening">Evening (2pm-10pm)</SelectItem>
                    <SelectItem value="Night">Night (10pm-6am)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-duty">On Duty</SelectItem>
                  <SelectItem value="off-duty">Off Duty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPerson}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Personnel Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Personnel</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this person from the security team? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedPerson && (
            <div className="py-4">
              <p className="font-medium">{selectedPerson.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedPerson.role} - {selectedPerson.location}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePerson}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

