// File service for handling file operations
export interface FileItem {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedBy: string
  uploadedAt: string
  roomId: string
}

class FileService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

  async uploadFile(file: File, roomId: string): Promise<FileItem> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("roomId", roomId)

    const response = await fetch(`${this.baseUrl}/files/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload file")
    }

    return response.json()
  }

  async getFiles(roomId: string): Promise<FileItem[]> {
    const response = await fetch(`${this.baseUrl}/files?roomId=${roomId}`)
    if (!response.ok) {
      throw new Error("Failed to fetch files")
    }
    return response.json()
  }

  async deleteFile(fileId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete file")
    }
  }

  async downloadFile(fileId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/files/${fileId}/download`)
    if (!response.ok) {
      throw new Error("Failed to download file")
    }
    return response.blob()
  }
}

export const fileService = new FileService()
