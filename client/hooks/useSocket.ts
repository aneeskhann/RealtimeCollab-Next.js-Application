'use client';

import { useEffect, useState } from 'react';
import {
  connectSocket,
  joinRoomSocket,
  leaveRoomSocket,
  onRoomUsersUpdate,
  disconnectSocket,
  getSocket,
} from '@/lib/socket';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export const useSocket = (roomCode: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!roomCode || !user) return;

    // 1. Connect to socket server
    connectSocket();

    // 2. Wait a moment for socket to initialize
    const interval = setInterval(() => {
      const socket = getSocket();
      if (!socket) return;

      // ✅ Now that socket is ready, proceed
      clearInterval(interval);

      // Join room
      joinRoomSocket(roomCode, user);

      // Sync participant list
      onRoomUsersUpdate((updatedUsers) => {
        setUsers(updatedUsers);
      });

      // Toast when another user joins
      const handleUserJoined = ({ username }: { username: string }) => {
        if (username !== user.username) {
          toast({
            title: `${username} joined the room`,
            variant: 'default',
          });
        }
      };

      // Toast when another user leaves
      const handleUserLeft = ({ username }: { username: string }) => {
        if (username !== user.username) {
          toast({
            title: `${username} left the room`,
            variant: 'default',
          });
        }
      };

      socket.on('user-joined', handleUserJoined);
      socket.on('user-left', handleUserLeft);

      // Cleanup on unmount
      return () => {
        leaveRoomSocket(roomCode, user.id);
        disconnectSocket();
        socket.off('user-joined', handleUserJoined);
        socket.off('user-left', handleUserLeft);
      };
    }, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, [roomCode, user?.id]);

  return { users };
};
