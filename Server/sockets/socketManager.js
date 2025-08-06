import { Room } from "../models/room.js"

export const registerSocketHandlers = (io, socket) => {
  console.log(`📥 [SOCKET] Connected: ${socket.id}`)

  socket.on("join-room", async ({ roomCode, user }) => {
    try {
      const room = await Room.findOne({ roomCode })
      if (!room || room.status === "ended") return

      socket.join(roomCode)

      socket.data.user = user // ✅ Cache user

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

  socket.on("disconnect", () => {
    console.log(`❌ [SOCKET] Disconnected: ${socket.id}`)

    const username = socket.data.user?.username
    const userId = socket.data.user?.id

    if (username && userId) {
      console.log(`🛑 User ${username} (${userId}) disconnected`)
    }
  })
}
