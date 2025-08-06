'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Mic, MicOff, Video, VideoOff, Monitor, Phone } from "lucide-react"

interface RoomControlsProps {
  roomCode: string
  isOwner: boolean
  onEnd?: () => void // Only shown if user is owner
}

export const RoomControls = ({ roomCode, isOwner, onEnd }: RoomControlsProps) => {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

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
              onClick={() => setIsMuted((prev) => !prev)}
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
              onClick={() => setIsVideoOff((prev) => !prev)}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isVideoOff ? "Turn On Video" : "Turn Off Video"}</TooltipContent>
        </Tooltip>

        {/* 🖥️ Share Screen Placeholder */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="lg" className="rounded-full w-12 h-12">
              <Monitor className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share Screen</TooltipContent>
        </Tooltip>

        {/* 🔚 End Call (Only for Owner) */}
        {isOwner && onEnd && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="lg"
                className="rounded-full w-12 h-12"
                onClick={onEnd}
              >
                <Phone className="h-5 w-5 rotate-[135deg]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>End Call for All</TooltipContent>
          </Tooltip>
        )}
      </div>
    </footer>
  )
}
