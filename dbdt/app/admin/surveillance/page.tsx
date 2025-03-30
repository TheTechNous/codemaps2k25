"use client"

import { Textarea } from "@/components/ui/textarea"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Shield,
  User,
  Search,
  Plus,
  AlertTriangle,
  Eye,
  MapPin,
  Clock,
  MoreHorizontal,
  Trash,
  Edit,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"

// Sample surveillance data
const initialSurveillanceStudents = [
  {
    id: "ST001",
    name: "Nakul",
    studentId: "ST12345",
    department: "Computer Science",
    riskLevel: "high",
    reason: "Multiple security incidents reported",
    surveillanceType: "location-tracking",
    lastSeen: "2025-10-15T14:30:00Z",
    lastLocation: "LH201, AI Building",
    incidentCount: 3,
    isActive: true,
  },
  {
    id: "ST002",
    name: "Aditya",
    studentId: "ST67890",
    department: "Psychology",
    riskLevel: "medium",
    reason: "Reported harassment incident",
    surveillanceType: "check-ins",
    lastSeen: "2025-10-16T09:45:00Z",
    lastLocation: "Science Lab, Room 302",
    incidentCount: 1,
    isActive: true,
  },
  {
    id: "ST003",
    name: "Adi",
    studentId: "ST54321",
    department: "Engineering",
    riskLevel: "low",
    reason: "Witness to security incident",
    surveillanceType: "passive",
    lastSeen: "2025-10-14T16:20:00Z",
    lastLocation: "C-Block, Cafeteria",
    incidentCount: 0,
    isActive: false,
  },
]

export default function StudentSurveillancePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser, emergencies } = useStore()

  const [surveillanceStudents, setSurveillanceStudents] = useState(initialSurveillanceStudents)
  const [filteredStudents, setFilteredStudents] = useState(initialSurveillanceStudents)
  const [searchQuery, setSearchQuery] = useState("")
  const [riskLevelFilter, setRiskLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    department: "",
    riskLevel: "low",
    reason: "",
    surveillanceType: "passive",
    isActive: true,
  })

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/admin/login")
    } else if (currentUser.role !== "admin") {
      router.push("/")
    }
  }, [currentUser, router])

  // Filter students based on search and filters
  useEffect(() => {
    let result = surveillanceStudents

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.studentId.toLowerCase().includes(query) ||
          student.department.toLowerCase().includes(query) ||
          student.department.toLowerCase().includes(query),
      )
    }

    // Risk level filter
    if (riskLevelFilter !== "all") {
      result = result.filter((student) => student.riskLevel === riskLevelFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active"
      result = result.filter((student) => student.isActive === isActive)
    }

    setFilteredStudents(result)
  }, [surveillanceStudents, searchQuery, riskLevelFilter, statusFilter])

  const resetForm = () => {
    setFormData({
      name: "",
      studentId: "",
      department: "",
      riskLevel: "low",
      reason: "",
      surveillanceType: "passive",
      isActive: true,
    })
  }

  const handleAddStudent = () => {
    if (!formData.name || !formData.studentId || !formData.reason) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newStudent = {
      id: `ST${String(surveillanceStudents.length + 4).padStart(3, "0")}`,
      ...formData,
      lastSeen: new Date().toISOString(),
      lastLocation: "Not available",
      incidentCount: 0,
    }

    setSurveillanceStudents([...surveillanceStudents, newStudent])
    setIsAddDialogOpen(false)
    resetForm()

    toast({
      title: "Student added",
      description: `${newStudent.name} has been added to surveillance`,
    })
  }

  const handleEditStudent = () => {
    if (!selectedStudent) return

    if (!formData.name || !formData.studentId || !formData.reason) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedStudents = surveillanceStudents.map((student) =>
      student.id === selectedStudent.id
        ? {
            ...student,
            ...formData,
          }
        : student,
    )

    setSurveillanceStudents(updatedStudents)
    setIsEditDialogOpen(false)
    resetForm()

    toast({
      title: "Student updated",
      description: `${formData.name}'s surveillance settings have been updated`,
    })
  }

  const handleDeleteStudent = () => {
    if (!selectedStudent) return

    const updatedStudents = surveillanceStudents.filter((student) => student.id !== selectedStudent.id)
    setSurveillanceStudents(updatedStudents)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Student removed",
      description: `${selectedStudent.name} has been removed from surveillance`,
    })
  }

  const openEditDialog = (student: any) => {
    setSelectedStudent(student)
    setFormData({
      name: student.name,
      studentId: student.studentId,
      department: student.department,
      riskLevel: student.riskLevel,
      reason: student.reason,
      surveillanceType: student.surveillanceType,
      isActive: student.isActive,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (student: any) => {
    setSelectedStudent(student)
    setIsDeleteDialogOpen(true)
  }

  const openViewDialog = (student: any) => {
    setSelectedStudent(student)
    setIsViewDialogOpen(true)
  }

  const toggleSurveillanceStatus = (student: any) => {
    const updatedStudents = surveillanceStudents.map((s) => (s.id === student.id ? { ...s, isActive: !s.isActive } : s))
    setSurveillanceStudents(updatedStudents)

    toast({
      title: `Surveillance ${!student.isActive ? "Activated" : "Deactivated"}`,
      description: `Surveillance for ${student.name} has been ${!student.isActive ? "activated" : "deactivated"}`,
    })
  }

  const getRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return <Badge className="bg-red-500">High Risk</Badge>
      case "medium":
        return <Badge className="bg-yellow-500">Medium Risk</Badge>
      case "low":
        return <Badge className="bg-green-500">Low Risk</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getSurveillanceTypeBadge = (type: string) => {
    switch (type) {
      case "location-tracking":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            Location Tracking
          </Badge>
        )
      case "check-ins":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-700">
            Regular Check-ins
          </Badge>
        )
      case "passive":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-700">
            Passive Monitoring
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? <Badge className="bg-green-500">Active</Badge> : <Badge variant="outline">Inactive</Badge>
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
                <h1 className="text-3xl font-bold tracking-tight">Student Surveillance</h1>
                <p className="text-muted-foreground">Monitor and track students who require special attention</p>
              </div>
              <Button
                onClick={() => {
                  resetForm()
                  setIsAddDialogOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Monitored</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{surveillanceStudents.length}</div>
                  <p className="text-xs text-muted-foreground">Students under surveillance</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {surveillanceStudents.filter((s) => s.riskLevel === "high").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Students requiring immediate attention</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {surveillanceStudents.filter((s) => s.isActive).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Currently being monitored</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader className="p-4">
                <CardTitle>Surveillance List</CardTitle>
                <CardDescription>{filteredStudents.length} students found</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Surveillance Type</TableHead>
                      <TableHead>Last Seen</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder-user.jpg`} alt={student.name} />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-muted-foreground">{student.studentId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRiskLevelBadge(student.riskLevel)}</TableCell>
                        <TableCell>{getSurveillanceTypeBadge(student.surveillanceType)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">
                              {new Date(student.lastSeen).toLocaleString()}
                            </span>
                            <span className="text-xs">{student.lastLocation}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(student.isActive)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openViewDialog(student)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(student)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleSurveillanceStatus(student)}>
                                {student.isActive ? (
                                  <>
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDeleteDialog(student)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Add Student Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Student to Surveillance</DialogTitle>
            <DialogDescription>Add a student who requires special monitoring</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Student name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="studentId">Student ID *</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="e.g., ST12345"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department/Major</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select
                  value={formData.riskLevel}
                  onValueChange={(value) => setFormData({ ...formData, riskLevel: value })}
                >
                  <SelectTrigger id="riskLevel">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="surveillanceType">Surveillance Type</Label>
                <Select
                  value={formData.surveillanceType}
                  onValueChange={(value) => setFormData({ ...formData, surveillanceType: value })}
                >
                  <SelectTrigger id="surveillanceType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passive">Passive Monitoring</SelectItem>
                    <SelectItem value="check-ins">Regular Check-ins</SelectItem>
                    <SelectItem value="location-tracking">Location Tracking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Surveillance *</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Explain why this student needs surveillance"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Activate surveillance immediately</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStudent}>Add to Surveillance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Surveillance Settings</DialogTitle>
            <DialogDescription>Update surveillance information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Student name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-studentId">Student ID *</Label>
                <Input
                  id="edit-studentId"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="e.g., ST12345"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-department">Department/Major</Label>
              <Input
                id="edit-department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-riskLevel">Risk Level</Label>
                <Select
                  value={formData.riskLevel}
                  onValueChange={(value) => setFormData({ ...formData, riskLevel: value })}
                >
                  <SelectTrigger id="edit-riskLevel">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-surveillanceType">Surveillance Type</Label>
                <Select
                  value={formData.surveillanceType}
                  onValueChange={(value) => setFormData({ ...formData, surveillanceType: value })}
                >
                  <SelectTrigger id="edit-surveillanceType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passive">Passive Monitoring</SelectItem>
                    <SelectItem value="check-ins">Regular Check-ins</SelectItem>
                    <SelectItem value="location-tracking">Location Tracking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-reason">Reason for Surveillance *</Label>
              <Textarea
                id="edit-reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Explain why this student needs surveillance"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">
                {formData.isActive ? "Surveillance is active" : "Surveillance is inactive"}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStudent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Student Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from Surveillance</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this student from surveillance? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="py-4">
              <p className="font-medium">{selectedStudent.name}</p>
              <p className="text-sm text-muted-foreground">Student ID: {selectedStudent.studentId}</p>
              <p className="text-sm text-muted-foreground">Department: {selectedStudent.department}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Student Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Surveillance Details</DialogTitle>
            <DialogDescription>Detailed information about surveillance</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="py-4 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`/placeholder-user.jpg`} alt={selectedStudent.name} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedStudent.name}</h2>
                  <p className="text-sm text-muted-foreground">Student ID: {selectedStudent.studentId}</p>
                  <p className="text-sm text-muted-foreground">Department: {selectedStudent.department}</p>
                  <div className="mt-1">{getRiskLevelBadge(selectedStudent.riskLevel)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Surveillance Type</h3>
                  <p>{getSurveillanceTypeBadge(selectedStudent.surveillanceType)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p>{getStatusBadge(selectedStudent.isActive)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Incidents</h3>
                  <p>{selectedStudent.incidentCount}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Added On</h3>
                  <p>{new Date(selectedStudent.lastSeen).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Reason for Surveillance</h3>
                <p className="p-3 bg-muted rounded-md">{selectedStudent.reason}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Known Location</h3>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{selectedStudent.lastLocation}</span>
                  <span className="text-xs text-muted-foreground">
                    ({new Date(selectedStudent.lastSeen).toLocaleString()})
                  </span>
                </div>
                <div className="mt-2 h-32 rounded-md bg-slate-100 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Location map would be displayed here</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Recent Activity</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">Checked in at Library</p>
                      <p className="text-xs text-muted-foreground">Today, 10:45 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm">Entered restricted area</p>
                      <p className="text-xs text-muted-foreground">Yesterday, 3:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">Left campus</p>
                      <p className="text-xs text-muted-foreground">Yesterday, 5:15 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedStudent && (
              <Button
                onClick={() => {
                  setIsViewDialogOpen(false)
                  openEditDialog(selectedStudent)
                }}
              >
                Edit Surveillance
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

