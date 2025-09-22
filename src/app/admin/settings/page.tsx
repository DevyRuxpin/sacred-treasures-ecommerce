"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Save, 
  Upload, 
  Globe, 
  Mail, 
  CreditCard, 
  Shield,
  Bell,
  Palette
} from "lucide-react"

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    site: {
      name: "Sacred Treasures",
      description: "Premium religious items for Muslim, Hindu, and Sikh communities",
      logo: "",
      favicon: "",
      currency: "USD",
      timezone: "America/New_York",
    },
    email: {
      fromName: "Sacred Treasures",
      fromEmail: "noreply@sacredtreasures.com",
      smtpHost: "smtp.gmail.com",
      smtpPort: "587",
      smtpUser: "",
      smtpPassword: "",
    },
    payment: {
      stripePublicKey: "",
      stripeSecretKey: "",
      stripeWebhookSecret: "",
      paypalClientId: "",
      paypalClientSecret: "",
    },
    security: {
      sessionTimeout: "24",
      maxLoginAttempts: "5",
      requireTwoFactor: false,
      allowedDomains: "",
    },
    notifications: {
      newOrderEmail: true,
      lowStockEmail: true,
      customerRegistrationEmail: true,
      orderStatusEmail: true,
    },
    appearance: {
      primaryColor: "#3B82F6",
      secondaryColor: "#64748B",
      fontFamily: "Inter",
      darkMode: false,
    },
  })

  const [activeTab, setActiveTab] = useState("site")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // In a real implementation, you would save to an API
    setTimeout(() => {
      setSaving(false)
      // Show success message
    }, 1000)
  }

  const tabs = [
    { id: "site", name: "Site Settings", icon: Globe },
    { id: "email", name: "Email Settings", icon: Mail },
    { id: "payment", name: "Payment Settings", icon: CreditCard },
    { id: "security", name: "Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "appearance", name: "Appearance", icon: Palette },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your store settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Site Settings */}
          {activeTab === "site" && (
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Configure your store&apos;s basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <Input
                      value={settings.site.name}
                      onChange={(e) => setSettings({
                        ...settings,
                        site: { ...settings.site, name: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={settings.site.currency}
                      onChange={(e) => setSettings({
                        ...settings,
                        site: { ...settings.site, currency: e.target.value }
                      })}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.site.description}
                    onChange={(e) => setSettings({
                      ...settings,
                      site: { ...settings.site, description: e.target.value }
                    })}
                    rows={3}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Upload className="h-6 w-6 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm">
                        Upload Logo
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favicon
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Upload className="h-4 w-4 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm">
                        Upload Favicon
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Email Settings */}
          {activeTab === "email" && (
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email notifications and SMTP settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Name
                    </label>
                    <Input
                      value={settings.email.fromName}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, fromName: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Email
                    </label>
                    <Input
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, fromEmail: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Host
                    </label>
                    <Input
                      value={settings.email.smtpHost}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, smtpHost: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Port
                    </label>
                    <Input
                      value={settings.email.smtpPort}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, smtpPort: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Username
                    </label>
                    <Input
                      value={settings.email.smtpUser}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, smtpUser: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Password
                    </label>
                    <Input
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, smtpPassword: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Settings */}
          {activeTab === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure payment gateway settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Stripe Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stripe Public Key
                      </label>
                      <Input
                        value={settings.payment.stripePublicKey}
                        onChange={(e) => setSettings({
                          ...settings,
                          payment: { ...settings.payment, stripePublicKey: e.target.value }
                        })}
                        placeholder="pk_test_..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stripe Secret Key
                      </label>
                      <Input
                        type="password"
                        value={settings.payment.stripeSecretKey}
                        onChange={(e) => setSettings({
                          ...settings,
                          payment: { ...settings.payment, stripeSecretKey: e.target.value }
                        })}
                        placeholder="sk_test_..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stripe Webhook Secret
                    </label>
                    <Input
                      type="password"
                      value={settings.payment.stripeWebhookSecret}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: { ...settings.payment, stripeWebhookSecret: e.target.value }
                      })}
                      placeholder="whsec_..."
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">PayPal Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PayPal Client ID
                      </label>
                      <Input
                        value={settings.payment.paypalClientId}
                        onChange={(e) => setSettings({
                          ...settings,
                          payment: { ...settings.payment, paypalClientId: e.target.value }
                        })}
                        placeholder="Client ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PayPal Client Secret
                      </label>
                      <Input
                        type="password"
                        value={settings.payment.paypalClientSecret}
                        onChange={(e) => setSettings({
                          ...settings,
                          payment: { ...settings.payment, paypalClientSecret: e.target.value }
                        })}
                        placeholder="Client Secret"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (hours)
                    </label>
                    <Input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Login Attempts
                    </label>
                    <Input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, maxLoginAttempts: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.requireTwoFactor}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, requireTwoFactor: e.target.checked }
                    })}
                    className="h-4 w-4 text-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed Domains (comma-separated)
                  </label>
                  <Input
                    value={settings.security.allowedDomains}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, allowedDomains: e.target.value }
                    })}
                    placeholder="example.com, another.com"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {key === "newOrderEmail" && "Send email when new order is placed"}
                        {key === "lowStockEmail" && "Send email when product stock is low"}
                        {key === "customerRegistrationEmail" && "Send welcome email to new customers"}
                        {key === "orderStatusEmail" && "Send email when order status changes"}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, [key]: e.target.checked }
                      })}
                      className="h-4 w-4 text-primary"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize your store&apos;s appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.appearance.primaryColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, primaryColor: e.target.value }
                        })}
                        className="h-10 w-16 border rounded"
                      />
                      <Input
                        value={settings.appearance.primaryColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, primaryColor: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.appearance.secondaryColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, secondaryColor: e.target.value }
                        })}
                        className="h-10 w-16 border rounded"
                      />
                      <Input
                        value={settings.appearance.secondaryColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          appearance: { ...settings.appearance, secondaryColor: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    value={settings.appearance.fontFamily}
                    onChange={(e) => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, fontFamily: e.target.value }
                    })}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Dark Mode</h4>
                    <p className="text-sm text-gray-600">Enable dark mode for the store</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.appearance.darkMode}
                    onChange={(e) => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, darkMode: e.target.checked }
                    })}
                    className="h-4 w-4 text-primary"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
