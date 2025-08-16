'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useRoom } from '@/hooks/useRoom'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { useSocket } from '@/hooks/useSocket'
import { useWebRTC } from '@/hooks/useWebRTC'

import { ParticipantGrid } from '@/components/room/ParticipantGrid'
import { RoomHeader } from '@/components/room/RoomHeader'
import { RoomPanelSwitcher } from '@/components/room/RoomPanelSwitcher'
import { RoomControls } from '@/components/room/RoomControls'
import { MediaPermissionRequest } from '@/components/room/MediaPermissionRequest'

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
  const [showPermissionRequest, setShowPermissionRequest] = useState(true)

  // WebRTC hook for video/audio streams
  const { 
    webrtcParticipants, 
    isWebRTCInitialized,
    webrtcError,
    addRemoteParticipant,
    removeRemoteParticipant,
    initializeLocalStream
  } = useWebRTC(roomCode)

  // Socket hook for room management
  const { users: socketUsers } = useSocket(roomCode)

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

  // Handle WebRTC errors
  useEffect(() => {
    if (webrtcError) {
      console.error('❌ WebRTC Error:', webrtcError);
      toast({
        title: "Media Error",
        description: webrtcError,
        variant: "destructive"
      })
    }
  }, [webrtcError, toast])

  // Debug logging for participants
  useEffect(() => {
    console.log('🔍 Room page - WebRTC participants:', webrtcParticipants);
    console.log('🔍 Room page - WebRTC initialized:', isWebRTCInitialized);
  }, [webrtcParticipants, isWebRTCInitialized]);

  // Sync socket users with WebRTC participants
  useEffect(() => {
    if (socketUsers.length > 0 && isWebRTCInitialized) {
      console.log('🔄 Syncing socket users with WebRTC participants:', socketUsers);
      socketUsers.forEach(socketUser => {
        // Skip if it's the local user
        if (socketUser.userId?._id === user?.id) return
        
        // Add remote participant if not already present
        const existingParticipant = webrtcParticipants.find(p => p._id === socketUser.userId?._id)
        if (!existingParticipant) {
          console.log('➕ Adding new remote participant:', socketUser);
          addRemoteParticipant({
            _id: socketUser.userId?._id || socketUser._id,
            userId: {
              username: socketUser.userId?.username || 'Unknown',
              avatar: socketUser.userId?.avatar
            },
            isMuted: false,
            isVideoOff: false
          })
        }
      })
    }
  }, [socketUsers, webrtcParticipants, isWebRTCInitialized, user?.id, addRemoteParticipant])

  const handlePermissionGranted = async () => {
    console.log('✅ Permissions granted, initializing local stream...');
    setShowPermissionRequest(false)
    try {
      await initializeLocalStream()
      console.log('✅ Local stream initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize stream after permission:', error)
      toast({
        title: "Stream Initialization Failed",
        description: "Failed to start video stream. Please check your camera and microphone.",
        variant: "destructive"
      })
    }
  }

  const handlePermissionDenied = () => {
    console.log('❌ Permissions denied, continuing without media');
    setShowPermissionRequest(false)
    toast({
      title: "Permissions Denied",
      description: "You can still join the room but won't be able to use video/audio",
      variant: "default"
    })
  }

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

  // Show permission request if not yet granted
  if (showPermissionRequest) {
    return (
      <div className="h-screen flex flex-col bg-gray-900">
        <RoomHeader
          roomCode={roomCode}
          participantCount={0}
          showCopy={true}
          onExit={onLeaveRoom}
        />
        <div className="flex-1 flex items-center justify-center p-6">
          <MediaPermissionRequest
            onPermissionGranted={handlePermissionGranted}
            onPermissionDenied={handlePermissionDenied}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* 🔝 Header */}
      <RoomHeader
        roomCode={roomCode}
        participantCount={webrtcParticipants.length}
        showCopy={true}
        onExit={onLeaveRoom}
      />

      {/* 🧑‍🤝‍🧑 Main */}
      <div className="flex flex-1 overflow-hidden">
        <div className={`p-6 overflow-y-auto transition-all duration-300 ${!activePanel ? "w-full" : "w-3/4"}`}>
          {isWebRTCInitialized ? (
            <ParticipantGrid 
              participants={webrtcParticipants} 
              localUser={user}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white/70">Initializing video...</p>
                <p className="text-xs text-gray-500 mt-2">Please wait while we set up your camera</p>
              </div>
            </div>
          )}
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
