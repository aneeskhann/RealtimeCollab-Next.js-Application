"use client"

import { useState, useEffect, useRef } from "react"
import {
  Upload, FileText, ImageIcon, Download, Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface FileItem {
  _id?: string
  filename: string
  originalname: string
  size: number
  type: "pdf" | "image" | "doc" | "other"
  uploadedBy: string
  timestamp: string
}

export function FilePanel() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const fetchFiles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/files")
      const data = await res.json()
      setFiles(data.files || [])
    } catch (err) {
      toast({ title: "Error", description: "Failed to load files", variant: "destructive" })
    }
  }

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      setUploading(true)
      const res = await fetch("http://localhost:5000/api/files/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        toast({ title: "File uploaded", description: data.data.originalname })
        setFiles((prev) => [data.data, ...prev])
      } else {
        throw new Error(data.message)
      }
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />
      case "image":
        return <ImageIcon className="h-8 w-8 text-blue-500" />
      case "doc":
        return <FileText className="h-8 w-8 text-blue-600" />
      default:
        return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files.length) {
      await handleUpload(e.dataTransfer.files[0])
    }
  }

  const handleDelete = async (fileId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/files/${fileId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setFiles((prev) => prev.filter((file) => file._id !== fileId))
        toast({ title: "File deleted" })
      } else {
        throw new Error("Delete failed")
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete file", variant: "destructive" })
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Files</h3>

        <Card
          className="border-2 border-dashed border-gray-600 bg-gray-700/50 p-6 text-center hover:border-gray-500 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-300">
            {uploading ? "Uploading..." : "Drop files here or click to upload"}
          </p>
          {uploading && <Progress value={progress || 50} className="mt-2 h-1" />}
        </Card>

        <input type="file" hidden ref={inputRef} onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {files.map((file) => (
            <Card key={file.filename} className="bg-gray-700/50 border-gray-600 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{file.originalname}</p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB • {file.uploadedBy || "You"} • {file.timestamp || "Just now"}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <a
                    href={`http://localhost:5000/uploads/${file.filename}`}
                    download
                    className="text-gray-300 hover:text-white"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-400"
                    onClick={() => handleDelete(file._id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
