import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  roomCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      joinedAt: { type: Date, default: Date.now }
    }
  ],
  chats: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }
  ],
  files: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'File' }
  ],
  whiteboards: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Whiteboard' }
  ],
  isPrivate: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  }
}, {
  timestamps: true
})

export const Room = mongoose.models.Room || mongoose.model('Room', roomSchema)
