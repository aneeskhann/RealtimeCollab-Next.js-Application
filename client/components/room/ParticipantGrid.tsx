import { ParticipantCard } from "./ParticipantCard"

interface Participant {
  _id: string
  userId: {
    username: string
    avatar?: string
  }
  isMuted?: boolean
  isVideoOff?: boolean
}

interface Props {
  participants: Participant[]
}

export const ParticipantGrid = ({ participants = [] }: Props) => (
  <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
    {participants.map((p) =>
      p && p._id ? (
        <ParticipantCard key={p._id} participant={p} />
      ) : (
        <div key={Math.random()} className="text-red-500">Invalid participant</div>
      )
    )}
  </div>
)

