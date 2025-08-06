import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['text', 'system', 'code', 'image'], default: 'text' },
  isEdited: { type: Boolean, default: false },
}, {
  timestamps: true // Adds createdAt and updatedAt
})

export const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema)
