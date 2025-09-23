"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FAQ } from "@/components/support/faq"
import { LiveChat, ChatToggle } from "@/components/support/live-chat"
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  FileText, 
  Search,
  Send,
  User,
  AlertCircle
} from "lucide-react"

export default function SupportPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"faq" | "contact" | "tickets">("faq")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "GENERAL_INQUIRY"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { value: "GENERAL_INQUIRY", label: "General Inquiry" },
    { value: "ORDER_SUPPORT", label: "Order Support" },
    { value: "PRODUCT_QUESTION", label: "Product Question" },
    { value: "TECHNICAL_ISSUE", label: "Technical Issue" },
    { value: "BILLING_QUESTION", label: "Billing Question" },
    { value: "RETURN_REQUEST", label: "Return Request" },
    { value: "COMPLAINT", label: "Complaint" },
    { value: "FEATURE_REQUEST", label: "Feature Request" }
  ]

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: contactForm.subject,
          description: contactForm.message,
          category: contactForm.category,
          priority: "MEDIUM"
        })
      })

      const data = await response.json()

      if (data.success) {
        // Reset form
        setContactForm({
          name: "",
          email: "",
          subject: "",
          message: "",
          category: "GENERAL_INQUIRY"
        })
        setActiveTab("tickets")
        alert("Support ticket created successfully!")
      } else {
        alert("Failed to create support ticket. Please try again.")
      }
    } catch (error) {
      console.error("Error creating support ticket:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Customer Support</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're here to help you with any questions or concerns about your Sacred Treasures experience.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center">
          <CardHeader>
            <MessageCircle className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Chat with our support team in real-time
            </p>
            <Button onClick={() => setIsChatOpen(true)} className="w-full">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Mail className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle>Email Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Send us an email and we'll respond within 24 hours
            </p>
            <Button variant="outline" className="w-full" asChild>
              <a href="mailto:support@sacredtreasures.com">
                Email Us
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Phone className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle>Phone Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Call us Monday through Friday, 9 AM to 6 PM EST
            </p>
            <Button variant="outline" className="w-full" asChild>
              <a href="tel:+1-555-SACRED-1">
                Call (555) SACRED-1
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Business Hours */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Support Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Live Chat & Phone</h4>
              <p className="text-muted-foreground">
                Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                Saturday: 10:00 AM - 4:00 PM EST<br />
                Sunday: Closed
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Email Support</h4>
              <p className="text-muted-foreground">
                We respond to all emails within 24 hours<br />
                Average response time: 4-6 hours during business days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex border-b">
          <Button
            variant={activeTab === "faq" ? "default" : "ghost"}
            onClick={() => setActiveTab("faq")}
            className="rounded-none"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </Button>
          <Button
            variant={activeTab === "contact" ? "default" : "ghost"}
            onClick={() => setActiveTab("contact")}
            className="rounded-none"
          >
            <Send className="h-4 w-4 mr-2" />
            Contact Us
          </Button>
          <Button
            variant={activeTab === "tickets" ? "default" : "ghost"}
            onClick={() => setActiveTab("tickets")}
            className="rounded-none"
          >
            <FileText className="h-4 w-4 mr-2" />
            My Tickets
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "faq" && (
        <FAQ />
      )}

      {activeTab === "contact" && (
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <p className="text-muted-foreground">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name *
                  </label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                </label>
                <Input
                  id="subject"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  required
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  value={contactForm.category}
                  onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  rows={6}
                  placeholder="Please provide as much detail as possible about your inquiry..."
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === "tickets" && (
        <Card>
          <CardHeader>
            <CardTitle>My Support Tickets</CardTitle>
            <p className="text-muted-foreground">
              View and manage your support tickets.
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tickets yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't created any support tickets yet.
              </p>
              <Button onClick={() => setActiveTab("contact")}>
                Create a Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Chat Components */}
      <LiveChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ChatToggle 
        onClick={() => setIsChatOpen(true)} 
        isOpen={isChatOpen}
      />
    </div>
  )
}
