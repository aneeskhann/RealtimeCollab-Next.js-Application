import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MicOff } from "lucide-react"

interface Participant {
  _id: string
  userId: {
    username: string
    avatar?: string
  }
  isMuted?: boolean
  isVideoOff?: boolean
}

export const ParticipantCard = ({ participant }: { participant: Participant }) => {
  const { userId, isMuted, isVideoOff } = participant
  const username = userId?.username || "Unknown"
  const avatar = userId?.avatar || "/placeholder.svg"

  return (
    <Card className="bg-gray-800 border border-gray-700 relative overflow-hidden">
      <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
        {isVideoOff ? (
          <Avatar className="w-16 h-16">
            <AvatarImage src={avatar} />
            <AvatarFallback>{username[0] || "U"}</AvatarFallback>
          </Avatar>
        ) : (
          <span className="text-white/50">Video Feed</span>
        )}
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <Badge variant="secondary" className="bg-black/50 text-white">
          {username}
        </Badge>
        {isMuted && (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <MicOff className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
    </Card>
  )
}
