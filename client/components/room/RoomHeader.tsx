'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Copy, Users, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type RoomHeaderProps = {
  roomCode: string
  participantCount: number
  showCopy?: boolean
  onExit?: () => void // Optional quick exit for all roles
}

export const RoomHeader = ({
  roomCode,
  participantCount,
  showCopy = false,
  onExit,
}: RoomHeaderProps) => {
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      toast({
        title: "Room Code Copied",
        description: "You can now share it with others.",
      })
    } catch {
      toast({
        title: "Copy Failed",
        description: "Try copying manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
      <div className="flex items-center space-x-4">
        <h1 className="text-white font-semibold text-lg">
          Room Code :
          
 {showCopy && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleCopy}
                variant="ghost"
                size="icon"
                className="text-white hover:text-indigo-300"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy Room Code</TooltipContent>
          </Tooltip>
        )}

           <span className="text-indigo-400">{roomCode}</span>
        </h1>

        <Badge className="bg-green-600 text-white">Live</Badge>

       
      </div>

      <div className="flex items-center space-x-4 text-white">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>{participantCount}</span>
        </div>

        {onExit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onExit}
                variant="ghost"
                size="icon"
                className="text-white hover:text-red-500"
                title="Leave Room"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Exit Room</TooltipContent>
          </Tooltip>
        )}
      </div>
    </header>
  )
}
