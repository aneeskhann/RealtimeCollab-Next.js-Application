import { nanoid } from 'nanoid'
import {
  createRoomService,
  getRoomByCodeService,
  joinRoomService,
  leaveRoomService,
  endRoomService,
} from '../services/roomservice.js'
import { Room } from '../models/room.js'


// ========== Create Room ==========
export const createRoom = async (req, res) => {
  try {
    const { name } = req.body
    const ownerId = req.user.id

    const roomData = {
      name,
      roomCode: nanoid(6),
      ownerId,
      participants: [{ userId: ownerId }],
      status: "active",
    }

    const room = await createRoomService(roomData)
    res.status(201).json({ message: "Room created successfully", room })
  } catch (error) {
    console.error("Error creating room:", error)
    res.status(500).json({ error: "Failed to create room" })
  }
}


// GET room by roomCode
export const getRoomByCode = async (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = await getRoomByCodeService(roomCode);
    if (!room) return res.status(404).json({ error: "Room not found" });
    return res.status(200).json({ room });
  } catch (error) {
    console.error("Error fetching room:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



export const joinRoom = async (req, res) => {
  try {
    const userId = req.user?.id; // optional auth
    const { roomCode } = req.params;

    const room = await getRoomByCodeService(roomCode);
    if (!room) return res.status(404).json({ error: "Room not found" });
    if (room.status === "ended") return res.status(403).json({ error: "Room has ended" });

    const updatedRoom = await joinRoomService(roomCode, userId);
    return res.status(200).json({ message: "Joined room", room: updatedRoom });
  } catch (error) {
    console.error("Error joining room:", error);
    return res.status(500).json({ error: "Error joining room" });
  }
};



export const leaveRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomCode } = req.body; // ✅ Was: req.params.roomCode ❌

    const room = await Room.findOne({ roomCode });
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const isParticipant = room.participants.some(
      (p) => p.userId.toString() === userId
    );

    if (!isParticipant) {
      return res.status(400).json({ error: "User is not a participant in this room" });
    }

    room.participants = room.participants.filter(
      (p) => p.userId.toString() !== userId
    );

    await room.save();
    return res.status(200).json({ message: 'Left room successfully' });
  } catch (error) {
    console.error("Error leaving room:", error);
    return res.status(500).json({ error: "Error leaving room" });
  }
};



export const endRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomCode } = req.body; // ✅ Was: req.params.roomCode ❌

    const room = await Room.findOne({ roomCode });
    if (!room) return res.status(404).json({ error: "Room not found" });

    if (room.ownerId.toString() !== userId) {
      return res.status(403).json({ error: "Only the room owner can end the room" });
    }

    room.status = "ended";
    await room.save();

    return res.status(200).json({ message: "Room ended successfully" });
  } catch (error) {
    console.error("Error ending room:", error);
    return res.status(500).json({ error: "Failed to end room" });
  }
};
