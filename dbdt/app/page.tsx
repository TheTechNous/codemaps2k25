import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, UserCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-6">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-foreground">UniSafe</h1>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Campus Safety in Your Hands
            </h2>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              A real-time emergency alert system designed to keep our campus community safe and secure.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <UserCircle className="h-16 w-16 text-primary" />
                <CardTitle className="text-2xl">Student Access</CardTitle>
                <CardDescription>Report emergencies, track responses, and stay informed</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p>
                  Access the student portal to report emergencies, view response status, and manage your emergency
                  contacts.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/student/login" className="w-full">
                  <Button className="w-full" size="lg">
                    Student Login
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <Shield className="h-16 w-16 text-primary" />
                <CardTitle className="text-2xl">Security Admin</CardTitle>
                <CardDescription>Manage incidents, coordinate responses, and ensure campus safety</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p>
                  Access the admin dashboard to view and manage emergency incidents, assign response teams, and generate
                  reports.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/login" className="w-full">
                  <Button className="w-full" size="lg" variant="outline">
                    Admin Login
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
        <section className="bg-muted py-12 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-[980px] text-center">
              <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
                Features Designed for Campus Safety
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our system is built to provide quick, efficient emergency response coordination
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Emergency Reporting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Report emergencies with a single tap and provide critical details through an intuitive interface.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Location Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Share your location with security personnel to receive faster assistance during emergencies.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Automatically notify your designated emergency contacts when you report an incident.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Incident Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Security admins can efficiently manage and coordinate responses to all reported incidents.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Status Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Receive real-time updates on the status of your reported emergency and response progress.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Multi-factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Enhanced security with multi-factor authentication to protect sensitive emergency data.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} UniSafe.
          </p>
          <div className="flex gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:underline">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

