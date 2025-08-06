'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useRoom } from '@/hooks/useRoom'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { useSocket } from '@/hooks/useSocket' // ✅ Real-time hook

import { ParticipantGrid } from '@/components/room/ParticipantGrid'
import { RoomHeader } from '@/components/room/RoomHeader'
import { RoomPanelSwitcher } from '@/components/room/RoomPanelSwitcher'
import { RoomControls } from '@/components/room/RoomControls'

export default function RoomPage() {
  const { id } = useParams()
  const roomCode = id as string
  const router = useRouter()

  const { user, token } = useAuth()
  const { toast } = useToast()

  const {
    room,
    loadRoomByCode,
    handleEndRoom,
    handleLeaveRoom,
    isLoading,
    error,
  } = useRoom()

  const [activePanel, setActivePanel] = useState<"chat" | "files" | "whiteboard" | null>(null)
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)

  // ✅ Load from useSocket
  const { users: liveParticipants } = useSocket(roomCode)

  const isOwner = user?.id === room?.ownerId

  useEffect(() => {
    if (roomCode) {
      loadRoomByCode(roomCode)
    }
  }, [roomCode])

  useEffect(() => {
    if (room?.status === 'ended') {
      router.push('/dashboard')
    }
  }, [room])

  const togglePanel = (panel: "chat" | "files" | "whiteboard") => {
    if (activePanel === panel && !isPanelCollapsed) {
      setIsPanelCollapsed(true)
    } else {
      setActivePanel(panel)
      setIsPanelCollapsed(false)
    }
  }

  const onLeaveRoom = async () => {
    try {
      if (!token) throw new Error("Unauthorized")
      await handleLeaveRoom(roomCode)
      toast({ title: "Left Room", description: "You have exited the room." })
    } catch (err) {
      toast({ title: "Failed to leave room", variant: "destructive" })
    }
  }

  const onEndRoom = async () => {
    try {
      if (!token) throw new Error("Unauthorized")
      await handleEndRoom(roomCode)
      toast({ title: "Room Ended", description: "Room has been closed." })
    } catch (err) {
      toast({ title: "Failed to end room", variant: "destructive" })
    }
  }

  if (isLoading) return <div className="text-white p-10">Loading Room...</div>
  if (error) return <div className="text-red-500 p-10">Error: {error}</div>
  if (!room || !room.roomCode) return <div className="text-gray-300 p-10">Room not found.</div>

  return (
    <div className="h-screen flex flex-col bg-gray-900">

      {/* 🔝 Header */}
      <RoomHeader
        roomCode={roomCode}
        participantCount={liveParticipants.length} // ✅ Live count
        showCopy={true}
        onExit={onLeaveRoom}
      />

      {/* 🧑‍🤝‍🧑 Main */}
      <div className="flex flex-1 overflow-hidden">
        <div className={`p-6 overflow-y-auto transition-all duration-300 ${!activePanel ? "w-full" : "w-3/4"}`}>
          <ParticipantGrid participants={liveParticipants} /> {/* ✅ Real-time */}
        </div>

        <RoomPanelSwitcher
          activePanel={activePanel}
          isCollapsed={isPanelCollapsed}
          togglePanel={togglePanel}
          setCollapsed={setIsPanelCollapsed}
        />
      </div>

      {/* 🔘 Bottom Controls */}
      <RoomControls
        roomCode={room.roomCode}
        isOwner={isOwner}
        onEnd={onEndRoom}
      />
    </div>
  )
}
