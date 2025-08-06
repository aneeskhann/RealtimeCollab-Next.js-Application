'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRoom } from '@/hooks/useRoom'
import { useToast } from '@/hooks/use-toast'

import { Plus, Video, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Dashboard() {
  const [roomCode, setRoomCode] = useState('')
  const { user, signOut } = useAuth()
  const { toast } = useToast()

  const {
    handleCreateRoom,
    handleJoinRoom,
    isLoading,
    error,
  } = useRoom()

  const onCreate = async () => {
    try {
      await handleCreateRoom('Untitled Room')
    } catch (err) {
      toast({
        title: 'Creation Failed',
        description: error || 'Could not create room',
        variant: 'destructive',
      })
    }
  }

  const onJoin = async () => {
    if (!roomCode.trim()) return
    try {
      await handleJoinRoom(roomCode.trim())
    } catch (err) {
      toast({
        title: 'Join Failed',
        description: error || 'Invalid room code',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b glass-effect">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">CS</span>
            </div>
            <h1 className="text-xl font-bold">CollabSpace</h1>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>{user?.username?.slice(0, 2) ?? 'JD'}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Create Room */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-blue-500" />
                <span>Create Room</span>
              </CardTitle>
              <CardDescription>Start a new collaboration</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={onCreate} disabled={isLoading} className="w-full">
                {isLoading ? 'Creating...' : 'Create New Room'}
              </Button>
            </CardContent>
          </Card>

          {/* Join Room */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5 text-green-500" />
                <span>Join Room</span>
              </CardTitle>
              <CardDescription>Enter room code to join</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
              <Button
                onClick={onJoin}
                disabled={isLoading}
                variant="outline"
                className="w-full bg-transparent"
              >
                {isLoading ? 'Joining...' : 'Join Room'}
              </Button>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}
