import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalName: { type: String, required: true },
  storageName: { type: String, required: true },
  fileType: { type: String }, // e.g. image/png, application/pdf
  fileSize: { type: Number }, // in bytes
  url: { type: String, required: true }, // S3, Cloudinary, or local path
}, {
  timestamps: true
})

export const File = mongoose.models.File || mongoose.model('File', fileSchema)
