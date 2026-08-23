// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Badge } from "@/components/ui/badge"
// import { User, Wallet, Bell, Shield, Save, Lock } from "lucide-react"

// export default function ResellerSettingsPage() {
//   const [emailNotifications, setEmailNotifications] = useState(true)
//   const [smsNotifications, setSmsNotifications] = useState(false)
//   const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
//         <p className="text-slate-500 mt-1">Manage your profile and preferences</p>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-3">
//         {/* Left Column - Settings */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Payment Details */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Wallet className="h-5 w-5" />
//                 Payment Information
//               </CardTitle>
//               <CardDescription>Configure your payout method</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="paymentMethod">Payment Method</Label>
//                 <select
//                   id="paymentMethod"
//                   className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
//                   defaultValue="momo"
//                 >
//                   <option value="momo">Mobile Money</option>
//                   <option value="bank">Bank Transfer</option>
//                 </select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="momoNumber">Mobile Money Number</Label>
//                 <Input id="momoNumber" type="tel" defaultValue="024 555 0101" />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="momoName">Account Name</Label>
//                 <Input id="momoName" defaultValue="John Doe" />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="network">Network</Label>
//                 <select
//                   id="network"
//                   className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
//                   defaultValue="mtn"
//                 >
//                   <option value="mtn">MTN Mobile Money</option>
//                   <option value="telecel">Telecel Cash</option>
//                   <option value="at">AT Money</option>
//                 </select>
//               </div>

//               <div className="flex justify-end">
//                 <Button className="bg-cyan-500 hover:bg-cyan-600">
//                   <Save className="mr-2 h-4 w-4" />
//                   Update Payment Info
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Security Settings */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Shield className="h-5 w-5" />
//                 Security Settings
//               </CardTitle>
//               <CardDescription>Manage your account security</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="currentPassword">Current Password</Label>
//                 <Input id="currentPassword" type="password" placeholder="••••••••" />
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="newPassword">New Password</Label>
//                   <Input id="newPassword" type="password" placeholder="••••••••" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="confirmPassword">Confirm Password</Label>
//                   <Input id="confirmPassword" type="password" placeholder="••••••••" />
//                 </div>
//               </div>

//               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="twoFactor" className="text-base font-medium">
//                     Two-Factor Authentication
//                   </Label>
//                   <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
//                 </div>
//                 <Switch id="twoFactor" checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
//               </div>

//               <div className="flex justify-end">
//                 <Button variant="outline">
//                   <Lock className="mr-2 h-4 w-4" />
//                   Change Password
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Column - Stats & Notifications */}
//         <div className="space-y-6">
//           {/* Account Status */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Account Status</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-slate-500">Reseller ID</span>
//                 <Badge variant="outline" className="font-mono">
//                   RES-001
//                 </Badge>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-slate-500">Status</span>
//                 <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-slate-500">Tier</span>
//                 <Badge variant="secondary">Silver</Badge>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-slate-500">Member Since</span>
//                 <span className="text-sm font-medium">Jan 2024</span>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Notification Preferences */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Bell className="h-5 w-5" />
//                 Notifications
//               </CardTitle>
//               <CardDescription>Choose how you receive updates</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="emailNotifs" className="text-sm font-medium">
//                     Email Notifications
//                   </Label>
//                   <p className="text-xs text-slate-500">Receive updates via email</p>
//                 </div>
//                 <Switch id="emailNotifs" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="smsNotifs" className="text-sm font-medium">
//                     SMS Notifications
//                   </Label>
//                   <p className="text-xs text-slate-500">Receive updates via SMS</p>
//                 </div>
//                 <Switch id="smsNotifs" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
//               </div>

//               <div className="pt-2 space-y-2">
//                 <p className="text-xs text-slate-500 font-medium">Get notified about:</p>
//                 <div className="space-y-2 pl-2">
//                   <label className="flex items-center gap-2 text-sm">
//                     <input type="checkbox" defaultChecked className="rounded" />
//                     New orders
//                   </label>
//                   <label className="flex items-center gap-2 text-sm">
//                     <input type="checkbox" defaultChecked className="rounded" />
//                     Commission payments
//                   </label>
//                   <label className="flex items-center gap-2 text-sm">
//                     <input type="checkbox" className="rounded" />
//                     Platform updates
//                   </label>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
























"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, MessageSquare, Phone, MessageCircle, Clock, Headphones } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}


      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="bg-cyan-50 border border-cyan-100 rounded-full p-3 inline-flex items-center justify-center mb-4">
              <Headphones className="h-6 w-6 text-cyan-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-3">
              Contact Support
            </h1>
            <p className="text-lg text-slate-600">
              We're here to help! Get in touch with us through any of the channels below.
            </p>
          </div>

          {/* Support Options */}
          <div className="space-y-4 mb-8">
            {/* WhatsApp Channel */}
            <Card className="shadow-lg border-2 border-green-100 hover:border-green-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Join Our WhatsApp Channel
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Get instant support, updates, and announcements directly on WhatsApp.
                    </p>
                    <a 
                      href="https://whatsapp.com/channel/0029VbBq6JzCnA7uwZUH4B3Y" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Join  Channel
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Second WhatsApp Channel */}
            <Card className="shadow-lg border-2 border-green-100 hover:border-green-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Join Our Reseller WhatsApp Channel
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Another channel for updates, tips, and community support for Resellers
                    </p>
                    <a
                      href="https://whatsapp.com/channel/0029Vb6kN0rHbFV1oeciKQ43"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Join Channel
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Hours Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Support Hours</h3>
                <p className="text-sm text-slate-600">Monday - Sunday: 8:00 AM - 9:00 PM</p>
                <p className="text-sm text-slate-500 mt-1">Average response time: Within 2 hours</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-cyan-50 border border-cyan-100 rounded-lg">
              <p className="text-sm text-cyan-900 font-medium mb-2">Quick Tips:</p>
              <ul className="space-y-1 text-sm text-cyan-700">
                <li>• Have your phone number ready when contacting us</li>
                <li>• Describe your issue clearly for faster resolution</li>
                <li>• Check our WhatsApp channel for common solutions</li>
              </ul>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link href="/buy/bundlepurchase">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold" size="lg">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t bg-white text-center text-sm text-slate-500">
        <div className="container mx-auto px-4">
          <p>&copy; 2025 Joy Data Bundles. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}