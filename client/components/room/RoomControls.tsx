'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Mic, MicOff, Video, VideoOff, Monitor, Phone } from "lucide-react"
import { webrtcService } from "@/services/webrtc-service"

interface RoomControlsProps {
  roomCode: string
  isOwner: boolean
  onEnd?: () => void // Only shown if user is owner
}

export const RoomControls = ({ roomCode, isOwner, onEnd }: RoomControlsProps) => {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [mediaState, setMediaState] = useState({ isVideoEnabled: false, isAudioEnabled: false, isScreenSharing: false })

  useEffect(() => {
    // Get initial media state
    const state = webrtcService.getMediaState()
    setMediaState(state)
    setIsMuted(!state.isAudioEnabled)
    setIsVideoOff(!state.isVideoEnabled)
    setIsScreenSharing(state.isScreenSharing)
  }, [])

  const handleMuteToggle = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    webrtcService.toggleAudio(!newMutedState)
    
    // Update media state
    const state = webrtcService.getMediaState()
    setMediaState(state)
  }

  const handleVideoToggle = () => {
    const newVideoState = !isVideoOff
    setIsVideoOff(newVideoState)
    webrtcService.toggleVideo(!newVideoState)
    
    // Update media state
    const state = webrtcService.getMediaState()
    setMediaState(state)
  }

  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        await webrtcService.startScreenSharing()
        setIsScreenSharing(true)
      } else {
        webrtcService.stopScreenSharing()
        setIsScreenSharing(false)
      }
    } catch (error) {
      console.error('Screen sharing error:', error)
    }
  }

  return (
    <footer className="bg-gray-800 px-6 py-4 border-t border-gray-700">
      <div className="flex items-center justify-center space-x-4">
        {/* 🎤 Mute Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="lg"
              className="rounded-full w-12 h-12"
              onClick={handleMuteToggle}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isMuted ? "Unmute" : "Mute"}</TooltipContent>
        </Tooltip>

        {/* 📷 Video Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isVideoOff ? "destructive" : "secondary"}
              size="lg"
              className="rounded-full w-12 h-12"
              onClick={handleVideoToggle}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isVideoOff ? "Turn On Video" : "Turn Off Video"}</TooltipContent>
        </Tooltip>

        {/* 🖥️ Share Screen */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={isScreenSharing ? "destructive" : "secondary"} 
              size="lg"
              className="rounded-full w-12 h-12"
              onClick={handleScreenShare}
            >
              <Monitor className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isScreenSharing ? "Stop Sharing" : "Share Screen"}
          </TooltipContent>
        </Tooltip>

        {/* 📞 End Call */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full w-12 h-12 bg-red-600 hover:bg-red-700"
              onClick={onEnd}
            >
              <Phone className="h-5 w-5 rotate-135" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>End Call</TooltipContent>
        </Tooltip>
      </div>
    </footer>
  )
}
