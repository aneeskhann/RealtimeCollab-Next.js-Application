import { ParticipantCard } from "./ParticipantCard"

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

interface Props {
  participants: Participant[]
  localUser?: any
}

export const ParticipantGrid = ({ participants = [], localUser }: Props) => {
  console.log('🔍 ParticipantGrid - Received participants:', participants);
  console.log('🔍 ParticipantGrid - Local user:', localUser);
  
  // Filter out any invalid participants
  const validParticipants = participants.filter(p => 
    p && p._id && p.userId && p.userId.username
  );
  
  console.log('🔍 ParticipantGrid - Valid participants:', validParticipants);
  
  // Check if anyone is screen sharing
  const screenSharingParticipant = validParticipants.find(p => p.isScreenSharing);
  const otherParticipants = validParticipants.filter(p => !p.isScreenSharing);
  
  // If no participants and we have a local user, show local user card
  if (validParticipants.length === 0 && localUser) {
    console.log('⚠️ ParticipantGrid - No valid participants, showing local user fallback');
    const fallbackParticipant: Participant = {
      _id: 'local',
      userId: {
        username: localUser.username || 'You',
        avatar: localUser.avatar
      },
      isMuted: false,
      isVideoOff: false,
      isLocal: true,
      isScreenSharing: false
    };
    validParticipants.push(fallbackParticipant);
  }

  // Determine grid layout based on screen sharing
  if (screenSharingParticipant) {
    return (
      <div className="grid grid-cols-4 grid-rows-3 gap-4 h-full w-full relative">
        {/* Screen sharing participant takes full grid */}
        <div className="col-span-4 row-span-3">
          <ParticipantCard participant={screenSharingParticipant} />
        </div>
        
        {/* Other participants positioned to the right side */}
        {otherParticipants.length > 0 && (
          <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
            {otherParticipants.map((participant) => (
              <div key={participant._id} className="w-32 h-24">
                <ParticipantCard participant={participant} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Normal grid layout for regular participants
  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1 grid-rows-1";
    if (count === 2) return "grid-cols-2 grid-rows-1";
    if (count === 3) return "grid-cols-2 grid-rows-2";
    if (count === 4) return "grid-cols-2 grid-rows-2";
    if (count === 5 || count === 6) return "grid-cols-3 grid-rows-2";
    if (count === 7 || count === 8) return "grid-cols-4 grid-rows-2";
    return "grid-cols-4 grid-rows-3";
  };

  const gridClass = getGridClass(validParticipants.length);

  return (
    <div className={`grid ${gridClass} gap-4 h-full w-full`}>
      {validParticipants.map((p) => {
        console.log('🎬 Rendering participant card:', p);
        return (
          <ParticipantCard key={p._id} participant={p} />
        );
      })}
    </div>
  )
}

