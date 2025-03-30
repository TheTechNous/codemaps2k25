"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { StudentHeader } from "@/components/student-header"
import { StudentSidebar } from "@/components/student-sidebar"
import { SidebarBackdrop } from "@/components/sidebar-backdrop"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { Book, HelpCircle, Mail, MessageCircle, Phone, Send } from "lucide-react"

export default function HelpSupportPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser } = useStore()

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/student/login")
    } else if (currentUser.role !== "student") {
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
      <StudentHeader />
      <SidebarBackdrop />
      <div className="flex flex-1">
        <StudentSidebar />
        <main className="flex-1 p-6">
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
              <p className="text-muted-foreground">Get assistance with the campus emergency alert system</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>Common questions and answers about using the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How do I report an emergency?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          To report an emergency, go to your dashboard and press the red "PANIC BUTTON". You'll be
                          prompted to select the type of emergency and provide details. Your location will be shared
                          with campus security if you have location sharing enabled in your settings.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>How do I add emergency contacts?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Navigate to the "Emergency Contacts" section from your dashboard or sidebar. Click "Add
                          Contact" and fill in the required information. These contacts will be notified when you report
                          an emergency if you have that option enabled.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>What happens after I report an emergency?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Once you report an emergency, campus security is immediately notified. They will assess the
                          situation and dispatch appropriate personnel. You can track the status of your reported
                          emergency on your dashboard. You'll also receive notifications as the status changes.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>How do I update my profile information?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Go to the "My Profile" section from your dashboard or sidebar. Click "Edit Profile" to update
                          your personal information, contact details, and other preferences. Remember to save your
                          changes.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger>Is my data secure and private?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Yes, your data is encrypted and securely stored. Your location information is only shared
                          during emergencies and with authorized personnel. You can control your privacy settings in the
                          "Settings" section of the app.
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
                    <p className="mt-1 font-medium">support@campus.edu</p>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                  </div>

                  <div className="flex flex-col items-center p-4 text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                      <Book className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">Help Center</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Browse our knowledge base</p>
                    <Button variant="link" className="mt-1 h-auto p-0">
                      Visit Help Center
                    </Button>
                    <p className="text-xs text-muted-foreground">Self-service support</p>
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

