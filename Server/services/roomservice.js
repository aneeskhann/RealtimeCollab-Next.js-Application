import { Room } from "../models/room.js";

// ===== Create =====
export const createRoomService = async ({ name, roomCode, ownerId }) => {
  if (!name || !roomCode || !ownerId) throw new Error("Missing required room data");

  const newRoom = new Room({
    name,
    roomCode,
    ownerId,
    participants: [{ userId: ownerId }],
    status: "active",
  });

  return await newRoom.save();
};

// ===== Get by Code =====
export const getRoomByCodeService = async (roomCode) => {
  return await Room.findOne({ roomCode }).populate("participants.userId", "username");
};

// ===== Join Room =====
export const joinRoomService = async (roomCode, userId) => {
  const room = await Room.findOne({ roomCode });
  if (!room || room.status === "ended") return null;

  const alreadyInRoom = room.participants.some((p) => p.userId.toString() === userId);
  if (!alreadyInRoom && userId) {
    room.participants.push({ userId });
    await room.save();
  }

  return room;
};

// ===== Leave Room =====
export const leaveRoomService = async (roomCode, userId) => {
  const room = await Room.findOne({ roomCode });
  if (!room) throw new Error("Room not found");

  const isParticipant = room.participants.some((p) => p.userId.toString() === userId);
  if (!isParticipant) throw new Error("User not a participant");

  room.participants = room.participants.filter((p) => p.userId.toString() !== userId);
  await room.save();
  return room;
};

// ===== End Room =====
export const endRoomService = async (roomCode, userId) => {
  const room = await Room.findOne({ roomCode });
  if (!room) throw new Error("Room not found");

  if (room.ownerId.toString() !== userId) {
    throw new Error("Only owner can end the room");
  }

  room.status = "ended";
  await room.save();
  return room;
};
