"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useStore } from "@/lib/store"
import { BarChart, Calendar, Download, FileText, PieChart, Share } from "lucide-react"
import { format } from "date-fns"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"
import { toast } from "@/components/ui/use-toast"

export default function ReportsPage() {
  const router = useRouter()
  const { currentUser, emergencies } = useStore()
  const [reportType, setReportType] = useState("incidents")
  const [timeRange, setTimeRange] = useState("month")
  const [isGenerating, setIsGenerating] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/admin/login")
    } else if (currentUser.role !== "admin") {
      router.push("/")
    }
  }, [currentUser, router])

  const handleGenerateReport = () => {
    setIsGenerating(true)

    // Simulate report generation
    setTimeout(() => {
      const reportData = {
        incidents: {
          total: totalIncidents,
          new: newIncidents,
          inProgress: inProgressIncidents,
          resolved: resolvedIncidents,
        },
        incidentTypes,
        timestamp: new Date().toISOString(),
        generatedBy: currentUser?.name || "Admin",
      }

      // Create a downloadable JSON file
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `campus-safety-report-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setIsGenerating(false)

      toast({
        title: "Report Generated",
        description: "Your report has been generated and downloaded successfully.",
      })
    }, 2000)
  }

  // Calculate some statistics for the reports
  const totalIncidents = emergencies.length
  const newIncidents = emergencies.filter((i) => i.status === "new").length
  const inProgressIncidents = emergencies.filter((i) => i.status === "in-progress").length
  const resolvedIncidents = emergencies.filter((i) => i.status === "resolved").length

  const incidentTypes = emergencies.reduce(
    (acc, incident) => {
      acc[incident.type] = (acc[incident.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

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
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
              <p className="text-muted-foreground">Generate and view safety and security reports</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalIncidents}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">New</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{newIncidents}</div>
                  <p className="text-xs text-muted-foreground">Awaiting response</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inProgressIncidents}</div>
                  <p className="text-xs text-muted-foreground">Being addressed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{resolvedIncidents}</div>
                  <p className="text-xs text-muted-foreground">Successfully handled</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Generate Report</CardTitle>
                <CardDescription>Create custom reports for campus safety and security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="report-type" className="text-sm font-medium">
                      Report Type
                    </label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="incidents">Incident Report</SelectItem>
                        <SelectItem value="personnel">Personnel Activity</SelectItem>
                        <SelectItem value="response">Response Time Analysis</SelectItem>
                        <SelectItem value="locations">Location Safety Analysis</SelectItem>
                        <SelectItem value="trends">Trend Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="time-range" className="text-sm font-medium">
                      Time Range
                    </label>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger id="time-range">
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Past Week</SelectItem>
                        <SelectItem value="month">Past Month</SelectItem>
                        <SelectItem value="quarter">Past Quarter</SelectItem>
                        <SelectItem value="year">Past Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {timeRange === "custom" && (
                    <>
                      <div className="grid gap-2">
                        <label htmlFor="start-date" className="text-sm font-medium">
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="start-date"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="end-date" className="text-sm font-medium">
                          End Date
                        </label>
                        <input
                          type="date"
                          id="end-date"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Include in Report</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="include-summary"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor="include-summary" className="text-sm">
                          Executive Summary
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="include-charts"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor="include-charts" className="text-sm">
                          Charts and Graphs
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="include-details"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor="include-details" className="text-sm">
                          Detailed Incident List
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="include-recommendations"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor="include-recommendations" className="text-sm">
                          Recommendations
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Report Format</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="format-pdf"
                          name="format"
                          defaultChecked
                          className="h-4 w-4 border-gray-300"
                        />
                        <label htmlFor="format-pdf" className="text-sm">
                          PDF Document
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="format-excel" name="format" className="h-4 w-4 border-gray-300" />
                        <label htmlFor="format-excel" className="text-sm">
                          Excel Spreadsheet
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="format-csv" name="format" className="h-4 w-4 border-gray-300" />
                        <label htmlFor="format-csv" className="text-sm">
                          CSV File
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Report
                </Button>
                <Button onClick={handleGenerateReport} disabled={isGenerating}>
                  {isGenerating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate & Download Report
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Tabs defaultValue="recent" className="space-y-4">
              <TabsList>
                <TabsTrigger value="recent">Recent Reports</TabsTrigger>
                <TabsTrigger value="saved">Saved Reports</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="recent" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>Reports generated in the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md border">
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <h3 className="font-medium">Monthly Incident Summary</h3>
                            <p className="text-sm text-muted-foreground">
                              Generated on {format(new Date(), "MMMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Share className="mr-2 h-4 w-4" />
                              Share
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                        <div className="border-t p-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-md border p-4">
                              <h4 className="mb-2 font-medium">Incident Types</h4>
                              <div className="flex h-40 items-center justify-center">
                                <PieChart className="h-32 w-32 text-muted-foreground" />
                              </div>
                            </div>
                            <div className="rounded-md border p-4">
                              <h4 className="mb-2 font-medium">Incidents by Location</h4>
                              <div className="flex h-40 items-center justify-center">
                                <BarChart className="h-32 w-32 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-md border">
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <h3 className="font-medium">Response Time Analysis</h3>
                            <p className="text-sm text-muted-foreground">
                              Generated on {format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), "MMMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Share className="mr-2 h-4 w-4" />
                              Share
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-md border">
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <h3 className="font-medium">Security Personnel Activity</h3>
                            <p className="text-sm text-muted-foreground">
                              Generated on {format(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), "MMMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Share className="mr-2 h-4 w-4" />
                              Share
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="saved" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Reports</CardTitle>
                    <CardDescription>Reports saved for future reference</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                        <h3 className="text-lg font-medium">No Saved Reports</h3>
                        <p className="text-sm text-muted-foreground">Save generated reports for quick access</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="scheduled" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Scheduled Reports</CardTitle>
                    <CardDescription>Reports scheduled for automatic generation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md border">
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <h3 className="font-medium">Weekly Incident Summary</h3>
                            <p className="text-sm text-muted-foreground">Every Monday at 8:00 AM</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Calendar className="mr-2 h-4 w-4" />
                              Edit Schedule
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-md border">
                        <div className="flex items-center justify-between p-4">
                          <div>
                            <h3 className="font-medium">Monthly Security Report</h3>
                            <p className="text-sm text-muted-foreground">1st day of each month at 9:00 AM</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Calendar className="mr-2 h-4 w-4" />
                              Edit Schedule
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

