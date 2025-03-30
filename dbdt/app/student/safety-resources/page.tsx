"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { StudentHeader } from "@/components/student-header"
import { StudentSidebar } from "@/components/student-sidebar"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, FileText, Phone, Shield, Video } from "lucide-react"
import { useStore } from "@/lib/store"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"

export default function SafetyResourcesPage() {
  const router = useRouter()
  const { currentUser } = useStore()

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/student/login")
    } else if (currentUser.role !== "student") {
      router.push("/")
    }
  }, [currentUser, router])

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
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Safety Resources</h1>
              <p className="text-muted-foreground">
                Access important safety information, guides, and emergency procedures
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Emergency Contacts
                  </CardTitle>
                  <CardDescription>Important phone numbers for emergencies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Campus Security</span>
                      <span className="font-mono">555-123-4567</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Health Center</span>
                      <span className="font-mono">555-123-4568</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Counseling Services</span>
                      <span className="font-mono">555-123-4569</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Police</span>
                      <span className="font-mono">112</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Fire Department</span>
                      <span className="font-mono">112</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/student/emergency-contacts")}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Manage My Emergency Contacts
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Safety Guides
                  </CardTitle>
                  <CardDescription>Downloadable safety procedures and guides</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Emergency Procedures</span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Campus Map with Exits</span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">First Aid Guide</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(
                            "https://drive.google.com/file/d/1l-i29Z336PlAawDFZh8JVk5DL5u-ARzv/view?usp=sharing",
                            "_blank",
                          )
                        }
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Active Shooter Response</span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Natural Disaster Plan</span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    Training Videos
                  </CardTitle>
                  <CardDescription>Safety training and instructional videos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="rounded-md border p-2">
                      <h3 className="font-medium">How to Use Emergency Alert App</h3>
                      <p className="text-xs text-muted-foreground">3:45 mins</p>
                      <Button variant="outline" size="sm" className="mt-2 w-full">
                        <Video className="mr-2 h-4 w-4" />
                        Watch Video
                      </Button>
                    </div>
                    <div className="rounded-md border p-2">
                      <h3 className="font-medium">CPR & Basic First Aid</h3>
                      <p className="text-xs text-muted-foreground">12:30 mins</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => window.open("https://youtu.be/GhBGMfLnY-k?si=GHMT2LiNIlhCKHXn", "_blank")}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Watch Video
                      </Button>
                    </div>
                    <div className="rounded-md border p-2">
                      <h3 className="font-medium">Campus Evacuation Procedures</h3>
                      <p className="text-xs text-muted-foreground">8:15 mins</p>
                      <Button variant="outline" size="sm" className="mt-2 w-full">
                        <Video className="mr-2 h-4 w-4" />
                        Watch Video
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions about campus safety and emergency procedures</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I report an emergency?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        In case of an emergency, you can use the Emergency Alert button on the dashboard of this app to
                        immediately notify campus security. Alternatively, you can call Campus Security directly at
                        555-123-4567 or dial 911 for police, fire, or medical emergencies.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Where are the emergency exits in campus buildings?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        All campus buildings have clearly marked emergency exits with illuminated signs. You can view
                        the locations of all emergency exits on the Campus Map section of this app. Additionally,
                        evacuation plans are posted near elevators and stairwells in all buildings.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How do I sign up for emergency notifications?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        You are automatically enrolled in emergency notifications when you register for this app. You
                        can manage your notification preferences in the Settings section. We recommend keeping all
                        emergency notifications enabled for your safety.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>What should I do if I feel unsafe on campus?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        If you feel unsafe, contact Campus Security immediately at 555-123-4567. You can also use the
                        Emergency Alert button in this app. Campus Security offers escort services for students walking
                        on campus after dark. Additionally, there are emergency phones located throughout campus that
                        connect directly to security.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Where can I find first aid supplies on campus?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        First aid kits are available in all campus buildings, typically located near the main entrance,
                        in administrative offices, and in laboratories. AED devices are also available in key locations,
                        which you can find on the Campus Map section of this app.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Campus Safety Website
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Safety Workshops & Training
                </CardTitle>
                <CardDescription>Upcoming safety training sessions and workshops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">First Aid Certification</h3>
                          <Badge>Next Week</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Learn basic first aid and CPR techniques. Certification provided upon completion.
                        </p>
                        <div className="mt-2 text-xs">
                          <div>Date: April 10, 2025</div>
                          <div>Location: Health Center</div>
                          <div>Duration: 3 hours</div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          Register
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Active Threat Response</h3>
                          <Badge>Next Month</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Learn how to respond to active threat situations on campus.
                        </p>
                        <div className="mt-2 text-xs">
                          <div>Date: May 22, 2025</div>
                          <div>Location: OAT</div>
                          <div>Duration: 2 hours</div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          Register
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Fire Safety Training</h3>
                          <Badge>Coming soon</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Learn about fire prevention and how to use fire extinguishers.
                        </p>
                        <div className="mt-2 text-xs">
                          <div>Date: Coming Soon</div>
                          <div>Location: Yuvraj Singh Stadium</div>
                          <div>Duration: 1.5 hours</div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          Register
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

