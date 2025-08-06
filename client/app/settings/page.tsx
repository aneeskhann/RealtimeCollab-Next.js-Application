"use client"

import { useState } from "react"
import { ArrowLeft, User, Lock, Bell, Shield, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
  })

  const [notifications, setNotifications] = useState({
    roomInvites: true,
    fileShares: true,
    mentions: true,
    emailUpdates: false,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl space-y-8">
        {/* Profile Settings */}
        <Card className="glass-card p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>

          <div className="flex items-center space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" />
              <AvatarFallback className="text-2xl">JD</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" className="rounded-xl bg-transparent">
                Change Avatar
              </Button>
              <Badge variant="secondary">{profile.role}</Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>

          <Button className="rounded-xl">Save Changes</Button>
        </Card>

        {/* Security Settings */}
        <Card className="glass-card p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <Lock className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-700 dark:text-green-300">Connection Secured</p>
                  <p className="text-sm text-green-600 dark:text-green-400">End-to-end encryption enabled</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                Active
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
                className="rounded-xl"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  className="rounded-xl"
                />
              </div>
            </div>

            <Button variant="outline" className="rounded-xl bg-transparent">
              Update Password
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="glass-card p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-purple-500" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Room Invitations</p>
                <p className="text-sm text-muted-foreground">Get notified when someone invites you to a room</p>
              </div>
              <Switch
                checked={notifications.roomInvites}
                onCheckedChange={(checked) => setNotifications({ ...notifications, roomInvites: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">File Shares</p>
                <p className="text-sm text-muted-foreground">Get notified when files are shared in your rooms</p>
              </div>
              <Switch
                checked={notifications.fileShares}
                onCheckedChange={(checked) => setNotifications({ ...notifications, fileShares: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mentions</p>
                <p className="text-sm text-muted-foreground">Get notified when someone mentions you in chat</p>
              </div>
              <Switch
                checked={notifications.mentions}
                onCheckedChange={(checked) => setNotifications({ ...notifications, mentions: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Updates</p>
                <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
              </div>
              <Switch
                checked={notifications.emailUpdates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, emailUpdates: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card className="glass-card p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <Palette className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <ThemeToggle />
          </div>
        </Card>
      </main>
    </div>
  )
}
