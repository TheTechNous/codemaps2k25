"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { Download, Edit, FileText, Link2, Plus, Search, Trash, Upload, Video } from "lucide-react"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"

// Sample resources data
const initialResources = [
  {
    id: "res1",
    title: "Emergency Response Procedures",
    type: "document",
    category: "procedures",
    description: "Comprehensive guide for responding to various campus emergencies",
    url: "#",
    fileSize: "2.4 MB",
    fileType: "PDF",
    uploadedBy: "Admin Security",
    uploadedAt: "2025-05-15T10:30:00Z",
  },
  {
    id: "res2",
    title: "Campus Security Training",
    type: "video",
    category: "training",
    description: "Training video for security personnel on campus patrol procedures",
    url: "#",
    duration: "45:20",
    uploadedBy: "Admin Security",
    uploadedAt: "2025-06-22T14:15:00Z",
  },
  {
    id: "res3",
    title: "First Aid and CPR Guide",
    type: "document",
    category: "medical",
    description: "Step-by-step guide for administering first aid and CPR",
    url: "#",
    fileSize: "3.8 MB",
    fileType: "PDF",
    uploadedBy: "Health Services",
    uploadedAt: "2025-04-10T09:45:00Z",
  },
  {
    id: "res4",
    title: "Active Threat Response Protocol",
    type: "document",
    category: "procedures",
    description: "Protocol for responding to active threats on campus",
    url: "#",
    fileSize: "1.2 MB",
    fileType: "PDF",
    uploadedBy: "Admin Security",
    uploadedAt: "2025-07-05T11:20:00Z",
  },
  {
    id: "res5",
    title: "De-escalation Techniques",
    type: "video",
    category: "training",
    description: "Training video on de-escalation techniques for security personnel",
    url: "#",
    duration: "32:15",
    uploadedBy: "Admin Security",
    uploadedAt: "2025-08-18T13:40:00Z",
  },
]

export default function ResourcesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser } = useStore()

  const [resources, setResources] = useState(initialResources)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    type: "document",
    category: "procedures",
    description: "",
    url: "",
    fileSize: "",
    fileType: "",
    duration: "",
  })

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/admin/login")
    } else if (currentUser.role !== "admin") {
      router.push("/")
    }
  }, [currentUser, router])

  // Filter resources based on search and category
  const filteredResources = resources.filter((resource) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = categoryFilter === "all" || resource.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const resetForm = () => {
    setFormData({
      title: "",
      type: "document",
      category: "procedures",
      description: "",
      url: "",
      fileSize: "",
      fileType: "",
      duration: "",
    })
  }

  const handleAddResource = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newResource = {
      id: `res${resources.length + 1}`,
      ...formData,
      uploadedBy: currentUser?.name || "Admin",
      uploadedAt: new Date().toISOString(),
    }

    setResources([...resources, newResource])
    setIsAddDialogOpen(false)
    resetForm()

    toast({
      title: "Resource added",
      description: `${newResource.title} has been added to resources`,
    })
  }

  const handleEditResource = () => {
    if (!selectedResource) return

    if (!formData.title || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedResources = resources.map((resource) =>
      resource.id === selectedResource.id
        ? {
            ...resource,
            ...formData,
          }
        : resource,
    )

    setResources(updatedResources)
    setIsEditDialogOpen(false)
    resetForm()

    toast({
      title: "Resource updated",
      description: `${formData.title} has been updated`,
    })
  }

  const handleDeleteResource = () => {
    if (!selectedResource) return

    const updatedResources = resources.filter((resource) => resource.id !== selectedResource.id)
    setResources(updatedResources)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Resource deleted",
      description: `${selectedResource.title} has been deleted`,
    })
  }

  const openEditDialog = (resource: any) => {
    setSelectedResource(resource)
    setFormData({
      title: resource.title,
      type: resource.type,
      category: resource.category,
      description: resource.description,
      url: resource.url,
      fileSize: resource.fileSize || "",
      fileType: resource.fileType || "",
      duration: resource.duration || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (resource: any) => {
    setSelectedResource(resource)
    setIsDeleteDialogOpen(true)
  }

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "video":
        return <Video className="h-5 w-5 text-red-500" />
      case "link":
        return <Link2 className="h-5 w-5 text-green-500" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "procedures":
        return <Badge className="bg-blue-500">Procedures</Badge>
      case "training":
        return <Badge className="bg-green-500">Training</Badge>
      case "medical":
        return <Badge className="bg-red-500">Medical</Badge>
      default:
        return <Badge>Other</Badge>
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
                <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
                <p className="text-muted-foreground">Manage safety and security resources</p>
              </div>
              <Button
                onClick={() => {
                  resetForm()
                  setIsAddDialogOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{resources.length}</div>
                  <p className="text-xs text-muted-foreground">Available resources</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{resources.filter((r) => r.type === "document").length}</div>
                  <p className="text-xs text-muted-foreground">PDF and document files</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{resources.filter((r) => r.type === "video").length}</div>
                  <p className="text-xs text-muted-foreground">Training and instructional videos</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search resources..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="procedures">Procedures</option>
                <option value="training">Training</option>
                <option value="medical">Medical</option>
              </select>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredResources.map((resource) => (
                    <Card key={resource.id}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            {getResourceTypeIcon(resource.type)}
                            <CardTitle className="text-lg">{resource.title}</CardTitle>
                          </div>
                          {getCategoryBadge(resource.category)}
                        </div>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="mt-2 text-sm text-muted-foreground">
                          {resource.type === "document" && (
                            <div className="flex items-center justify-between">
                              <span>Size: {resource.fileSize}</span>
                              <span>Type: {resource.fileType}</span>
                            </div>
                          )}
                          {resource.type === "video" && <div>Duration: {resource.duration}</div>}
                          <div className="mt-1">
                            Uploaded by {resource.uploadedBy} on {new Date(resource.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <div className="flex w-full justify-between gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(resource)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(resource)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="documents" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredResources
                    .filter((resource) => resource.type === "document")
                    .map((resource) => (
                      <Card key={resource.id}>
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2">
                              <FileText className="h-5 w-5 text-blue-500" />
                              <CardTitle className="text-lg">{resource.title}</CardTitle>
                            </div>
                            {getCategoryBadge(resource.category)}
                          </div>
                          <CardDescription>{resource.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center justify-between">
                              <span>Size: {resource.fileSize}</span>
                              <span>Type: {resource.fileType}</span>
                            </div>
                            <div className="mt-1">
                              Uploaded by {resource.uploadedBy} on {new Date(resource.uploadedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <div className="flex w-full justify-between gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(resource)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(resource)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="videos" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredResources
                    .filter((resource) => resource.type === "video")
                    .map((resource) => (
                      <Card key={resource.id}>
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2">
                              <Video className="h-5 w-5 text-red-500" />
                              <CardTitle className="text-lg">{resource.title}</CardTitle>
                            </div>
                            {getCategoryBadge(resource.category)}
                          </div>
                          <CardDescription>{resource.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="mt-2 text-sm text-muted-foreground">
                            <div>Duration: {resource.duration}</div>
                            <div className="mt-1">
                              Uploaded by {resource.uploadedBy} on {new Date(resource.uploadedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <div className="flex w-full justify-between gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Video className="mr-2 h-4 w-4" />
                              Watch
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(resource)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(resource)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="links" className="space-y-4">
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Link2 className="h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No Links</h3>
                    <p className="text-sm text-muted-foreground">Add external links to important resources</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Add Resource Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
            <DialogDescription>Add a new resource to the system</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Resource title"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Resource Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="document">Document</option>
                  <option value="video">Video</option>
                  <option value="link">External Link</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="procedures">Procedures</option>
                  <option value="training">Training</option>
                  <option value="medical">Medical</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Resource description"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL or File</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="URL or file path"
                />
                <Button variant="outline" type="button">
                  <Upload className="mr-2 h-4 w-4" />
                  Browse
                </Button>
              </div>
            </div>
            {formData.type === "document" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fileSize">File Size</Label>
                  <Input
                    id="fileSize"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    placeholder="e.g., 2.4 MB"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fileType">File Type</Label>
                  <Input
                    id="fileType"
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    placeholder="e.g., PDF"
                  />
                </div>
              </div>
            )}
            {formData.type === "video" && (
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 45:20"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddResource}>Add Resource</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Resource Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>Update resource information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Resource title"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Resource Type</Label>
                <select
                  id="edit-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="document">Document</option>
                  <option value="video">Video</option>
                  <option value="link">External Link</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <select
                  id="edit-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="procedures">Procedures</option>
                  <option value="training">Training</option>
                  <option value="medical">Medical</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Resource description"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-url">URL or File</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="URL or file path"
                />
                <Button variant="outline" type="button">
                  <Upload className="mr-2 h-4 w-4" />
                  Browse
                </Button>
              </div>
            </div>
            {formData.type === "document" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-fileSize">File Size</Label>
                  <Input
                    id="edit-fileSize"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    placeholder="e.g., 2.4 MB"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-fileType">File Type</Label>
                  <Input
                    id="edit-fileType"
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    placeholder="e.g., PDF"
                  />
                </div>
              </div>
            )}
            {formData.type === "video" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-duration">Duration</Label>
                <Input
                  id="edit-duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 45:20"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditResource}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Resource Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedResource && (
            <div className="py-4">
              <p className="font-medium">{selectedResource.title}</p>
              <p className="text-sm text-muted-foreground">{selectedResource.description}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteResource}>
              Delete Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

