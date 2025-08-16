import { Room } from "../models/room.js"

export const registerSocketHandlers = (io, socket) => {
  console.log(`📥 [SOCKET] Connected: ${socket.id}`)

  socket.on("join-room", async ({ roomCode, user }) => {
    try {
      const room = await Room.findOne({ roomCode })
      if (!room || room.status === "ended") return

      socket.join(roomCode)

      socket.data.user = user // ✅ Cache user
      socket.data.roomCode = roomCode // Cache room code

      const exists = room.participants.some(
        (p) => p.userId.toString() === user.id
      )
      if (!exists) {
        room.participants.push({ userId: user.id })
        await room.save()
      }

      const populatedRoom = await Room.findOne({ roomCode }).populate(
        "participants.userId",
        "username"
      )

      io.to(roomCode).emit("room-users", populatedRoom.participants)

      // ✅ Emit full user object
      io.to(roomCode).emit("user-joined", {
        user: {
          id: user.id,
          username: user.username,
        },
      })

      console.log(`✅ ${user.username} joined room ${roomCode}`)
    } catch (err) {
      console.error("❌ join-room error:", err)
    }
  })

  socket.on("leave-room", async ({ roomCode, userId }) => {
    try {
      const room = await Room.findOne({ roomCode })
      if (!room) return

      room.participants = room.participants.filter(
        (p) => p.userId.toString() !== userId
      )
      await room.save()

      const updatedParticipants = await Room.findOne({ roomCode }).populate(
        "participants.userId",
        "username"
      )

      const username = socket.data.user?.username || "Unknown"

      io.to(roomCode).emit("room-users", updatedParticipants.participants)

      // ✅ Emit full user object
      io.to(roomCode).emit("user-left", {
        user: {
          id: userId,
          username,
        },
      })

      console.log(`👋 User ${username} left room ${roomCode}`)
    } catch (err) {
      console.error("❌ leave-room error:", err)
    }
  })

  // WebRTC Signaling Events
  socket.on("webrtc-offer", ({ roomCode, targetUserId, offer }) => {
    try {
      // Forward the offer to the target user
      socket.to(roomCode).emit("webrtc-offer", {
        fromUserId: socket.data.user?.id,
        offer
      })
      console.log(`📤 WebRTC offer from ${socket.data.user?.username} to ${targetUserId}`)
    } catch (err) {
      console.error("❌ webrtc-offer error:", err)
    }
  })

  socket.on("webrtc-answer", ({ roomCode, targetUserId, answer }) => {
    try {
      // Forward the answer to the target user
      socket.to(roomCode).emit("webrtc-answer", {
        fromUserId: socket.data.user?.id,
        answer
      })
      console.log(`📤 WebRTC answer from ${socket.data.user?.username} to ${targetUserId}`)
    } catch (err) {
      console.error("❌ webrtc-answer error:", err)
    }
  })

  socket.on("ice-candidate", ({ roomCode, targetUserId, candidate }) => {
    try {
      // Forward the ICE candidate to the target user
      socket.to(roomCode).emit("ice-candidate", {
        fromUserId: socket.data.user?.id,
        candidate
      })
      console.log(`📤 ICE candidate from ${socket.data.user?.username} to ${targetUserId}`)
    } catch (err) {
      console.error("❌ ice-candidate error:", err)
    }
  })

  socket.on("disconnect", () => {
    console.log(`❌ [SOCKET] Disconnected: ${socket.id}`)

    const username = socket.data.user?.username
    const userId = socket.data.user?.id
    const roomCode = socket.data.roomCode

    if (username && userId && roomCode) {
      console.log(`🛑 User ${username} (${userId}) disconnected from room ${roomCode}`)
      
      // Notify other users in the room
      socket.to(roomCode).emit("user-left", {
        user: {
          id: userId,
          username,
        },
      })
    }
  })
}
