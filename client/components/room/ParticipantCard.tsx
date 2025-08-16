import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MicOff, VideoOff } from "lucide-react"

interface Participant {
  _id: string
  userId: {
    username: string
    avatar?: string
  }
  isMuted?: boolean
  isVideoOff?: boolean
  stream?: MediaStream
  isLocal?: boolean
  isScreenSharing?: boolean
}

export const ParticipantCard = ({ participant }: { participant: Participant }) => {
  const { userId, isMuted, isVideoOff, stream, isLocal, isScreenSharing } = participant
  const username = userId?.username || "Unknown"
  const avatar = userId?.avatar || "/placeholder.svg"
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasVideoStream, setHasVideoStream] = useState(false)

  // Effect to handle video stream when both element and stream are ready
  useEffect(() => {
    console.log('🎥 ParticipantCard useEffect - stream:', stream, 'isLocal:', isLocal, 'username:', username);
    
    // Check if we have both the video element and stream
    if (videoRef.current && stream && stream.active) {
      console.log('✅ Setting video srcObject for participant:', username);
      
      try {
        videoRef.current.srcObject = stream;
        
        // Ensure video plays with proper error handling
        const playVideo = async () => {
          try {
            if (videoRef.current && !hasVideoStream) {
              await videoRef.current.play();
              setHasVideoStream(true);
              console.log('✅ Video playing successfully for:', username);
            }
          } catch (error) {
            console.error('Failed to play video:', error);
            setHasVideoStream(false);
          }
        };

        // Small delay to ensure video element is ready
        setTimeout(playVideo, 100);
        
        console.log('✅ Video stream set successfully for:', username);
      } catch (error) {
        console.error('❌ Error setting video stream:', error);
        setHasVideoStream(false);
      }
    } else {
      console.log('❌ Waiting for video element or stream for participant:', username, {
        hasVideoRef: !!videoRef.current,
        hasStream: !!stream,
        streamActive: stream?.active
      });
      setHasVideoStream(false);
    }
  }, [stream, username, isLocal, hasVideoStream]);

  // Effect to check video element readiness
  useEffect(() => {
    const checkVideoElement = () => {
      if (videoRef.current && stream && stream.active && !hasVideoStream) {
        console.log('🔄 Video element ready, retrying stream setup for:', username);
        
        try {
          videoRef.current.srcObject = stream;
          
          const playVideo = async () => {
            try {
              if (videoRef.current && !hasVideoStream) {
                await videoRef.current.play();
                setHasVideoStream(true);
                console.log('✅ Video playing successfully on retry for:', username);
              }
            } catch (error) {
              console.error('Failed to play video on retry:', error);
            }
          };

          setTimeout(playVideo, 100);
          
          console.log('✅ Video stream set successfully on retry for:', username);
        } catch (error) {
          console.error('❌ Error setting video stream on retry:', error);
        }
      }
    };

    // Check immediately
    checkVideoElement();
    
    // Also check after a short delay to handle timing issues
    const timeoutId = setTimeout(checkVideoElement, 200);
    
    return () => clearTimeout(timeoutId);
  }, [stream, username, hasVideoStream]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 ParticipantCard state:', {
      username,
      isLocal,
      isVideoOff,
      hasStream: !!stream,
      streamActive: stream?.active,
      hasVideoRef: !!videoRef.current,
      hasVideoStream,
      isScreenSharing,
      shouldShowVideo: !isVideoOff && hasVideoStream && stream && stream.active
    });
  }, [username, isLocal, isVideoOff, stream, hasVideoStream, isScreenSharing]);

  const shouldShowVideo = !isVideoOff && hasVideoStream && stream && stream.active
  const hasStream = stream && stream.active

  return (
    <Card className={`bg-gray-800 border border-gray-700 relative overflow-hidden ${
      isScreenSharing ? 'col-span-full row-span-full' : ''
    }`}>
      <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center relative">
        {/* Always render video element if we have a stream */}
        {hasStream && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal} // Local video should be muted to prevent feedback
            className={`w-full h-full object-cover rounded transition-opacity duration-300 ${
              shouldShowVideo ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ minHeight: '200px' }}
          />
        )}
        
        {/* Show avatar when video is off or not ready */}
        {(!hasStream || !shouldShowVideo) && (
          <Avatar className="w-16 h-16">
            <AvatarImage src={avatar} />
            <AvatarFallback>{username[0] || "U"}</AvatarFallback>
          </Avatar>
        )}
        
        {/* Video Off Indicator */}
        {isVideoOff && (
          <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
            <VideoOff className="h-4 w-4 text-white" />
          </div>
        )}

        {/* Screen Sharing Indicator */}
        {isScreenSharing && (
          <div className="absolute top-2 left-2 bg-green-500/80 rounded-full px-2 py-1">
            <span className="text-xs text-white font-medium">Screen Share</span>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <Badge variant="secondary" className="bg-black/50 text-white">
          {username} {isLocal && "(You)"} {isScreenSharing && "(Screen)"}
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
