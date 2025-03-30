"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { HelpCircle, Mail, MessageCircle, Phone, Send } from "lucide-react"

export default function AdminHelpSupportPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser } = useStore()

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/admin/login")
    } else if (currentUser.role !== "admin") {
      router.push("/")
    }
  }, [currentUser, router])

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message sent",
      description: "We've received your message and will respond shortly.",
    })
    // Reset form - in a real app we would get form data and send it to an API
    const form = e.target as HTMLFormElement
    form.reset()
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
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
              <p className="text-muted-foreground">Get assistance with the security admin panel</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>Common questions and answers about using the admin panel</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How do I respond to a new emergency incident?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          To respond to a new emergency, go to the Incidents page and find the incident in the list.
                          Click on the three dots menu and select "View Full Detail". From there, you can update the
                          status to "In Progress" and assign personnel to handle the incident.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>How do I set up geofencing zones?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Navigate to the Geofencing section from the sidebar. Click "Add Zone" and fill in the required
                          information. You can draw the zone boundaries on the map and set specific restrictions and
                          alert levels for each zone.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>How do I generate security reports?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Go to the Reports section from the sidebar. Select the report type, time range, and any
                          specific parameters you need. Click "Generate & Download Report" to create and download the
                          report in your preferred format.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>How do I manage security personnel?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Access the Personnel section from the sidebar. Here you can view all security staff, add new
                          personnel, edit their information, and manage their status. You can also assign them to
                          specific incidents or areas.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger>How do I set up student surveillance?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Navigate to the Student Surveillance section. Click "Add Student" to add a student to the
                          surveillance list. You can set their risk level, surveillance type, and the reason for
                          monitoring. Make sure to follow all privacy policies and regulations when using this feature.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    Contact Support
                  </CardTitle>
                  <CardDescription>Send us a message and we'll get back to you</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid gap-2">
                      <label htmlFor="subject">Subject</label>
                      <Input id="subject" placeholder="Enter subject" required />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="message">Message</label>
                      <Textarea id="message" placeholder="Describe your issue or question" rows={5} required />
                    </div>
                    <Button type="submit" className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
                <CardDescription>Alternative ways to reach support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex flex-col items-center p-4 text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">Phone Support</h3>
                    <p className="mt-2 text-sm text-muted-foreground">For urgent support issues</p>
                    <p className="mt-1 font-medium">555-123-4567</p>
                    <p className="text-xs text-muted-foreground">Available 24/7</p>
                  </div>

                  <div className="flex flex-col items-center p-4 text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">Email Support</h3>
                    <p className="mt-2 text-sm text-muted-foreground">For general inquiries</p>
                    <p className="mt-1 font-medium">admin-support@unisafe.edu</p>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                  </div>

                  <div className="flex flex-col items-center p-4 text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">Live Chat</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Instant support during business hours</p>
                    <Button variant="link" className="mt-1 h-auto p-0">
                      Start Chat
                    </Button>
                    <p className="text-xs text-muted-foreground">8am - 8pm, Monday to Friday</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

