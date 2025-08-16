import io from 'socket.io-client';

let socket: ReturnType<typeof io> | null = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000'); // Use your backend
  }
};

export const getSocket = () => socket;

export const joinRoomSocket = (roomCode: string, user: any) => {
  socket?.emit('join-room', { roomCode, user });
};

export const leaveRoomSocket = (roomCode: string, userId: string) => {
  socket?.emit('leave-room', { roomCode, userId });
};

export const onRoomUsersUpdate = (callback: (users: any[]) => void) => {
  socket?.on('room-users', callback);
};

// WebRTC Signaling Events
export const emitWebRTCOffer = (roomCode: string, targetUserId: string, offer: RTCSessionDescriptionInit) => {
  socket?.emit('webrtc-offer', { roomCode, targetUserId, offer });
};

export const emitWebRTCAnswer = (roomCode: string, targetUserId: string, answer: RTCSessionDescriptionInit) => {
  socket?.emit('webrtc-answer', { roomCode, targetUserId, answer });
};

export const emitICECandidate = (roomCode: string, targetUserId: string, candidate: RTCIceCandidateInit) => {
  socket?.emit('ice-candidate', { roomCode, targetUserId, candidate });
};

// WebRTC Event Listeners
export const onWebRTCOffer = (callback: (data: { fromUserId: string; offer: RTCSessionDescriptionInit }) => void) => {
  socket?.on('webrtc-offer', callback);
};

export const onWebRTCAnswer = (callback: (data: { fromUserId: string; answer: RTCSessionDescriptionInit }) => void) => {
  socket?.on('webrtc-answer', callback);
};

export const onICECandidate = (callback: (data: { fromUserId: string; candidate: RTCIceCandidateInit }) => void) => {
  socket?.on('ice-candidate', callback);
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
