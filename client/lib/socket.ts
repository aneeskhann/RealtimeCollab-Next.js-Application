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

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
