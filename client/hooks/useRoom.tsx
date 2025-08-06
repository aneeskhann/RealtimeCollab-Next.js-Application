'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createRoom,
  joinRoomByCode,
  fetchRoomByCode,
  endRoom,
  leaveRoom,
} from '@/services/room-service';
import { useAuth } from './use-auth';

export const useRoom = () => {
  const [room, setRoom] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { token } = useAuth();

  // Load room (used on RoomPage mount)
  const loadRoomByCode = async (roomCode: string) => {
    try {
      setIsLoading(true);
      const res = await fetchRoomByCode(roomCode, token);
      setRoom(res.room);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Room not found');
    } finally {
      setIsLoading(false);
    }
  };

  // Create room then redirect
  const handleCreateRoom = async (name: string) => {
    try {
      setIsLoading(true);
      const res = await createRoom({ name, token: token! });
      setRoom(res.room);
      router.push(`/room/${res.room.roomCode}`);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  // Join room via roomCode in URL
  const handleJoinRoom = async (roomCode: string) => {
    try {
      setIsLoading(true);
      const res = await joinRoomByCode(roomCode, token!);
      setRoom(res.room);
      router.push(`/room/${res.room.roomCode}`);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  // End room (owner only)
  const handleEndRoom = async (roomCode: string) => {
    try {
      await endRoom(roomCode, token!);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to end room');
    }
  };

  // Leave room (participant only)
  const handleLeaveRoom = async (roomCode: string) => {
    try {
      await leaveRoom(roomCode, token!);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error leaving room:', err);
    }
  };

  return {
    room,
    error,
    isLoading,
    loadRoomByCode,
    handleCreateRoom,
    handleJoinRoom,
    handleEndRoom,
    handleLeaveRoom,
  };
};
