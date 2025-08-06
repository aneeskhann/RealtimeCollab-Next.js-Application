import mongoose from 'mongoose'

const whiteboardSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} }, // JSON data for canvas
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
})

export const Whiteboard = mongoose.models.Whiteboard || mongoose.model('Whiteboard', whiteboardSchema)
