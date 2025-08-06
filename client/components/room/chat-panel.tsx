"use client"

import { useState } from "react"

interface Message {
  id: number
  text: string
  sender: string
  isOwn: boolean
}

export const ChatPanel = () => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to the chat!",
      sender: "System",
      isOwn: false,
    },
  ])

  const handleSend = () => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: "You",
      isOwn: true,
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")
  }

  return (
    <div className="bg-gray-800 text-white p-4 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-md max-w-xs ${
              msg.isOwn ? "bg-blue-600 ml-auto" : "bg-gray-600"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            <p className="text-xs text-gray-300">{msg.sender}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-3 py-2 rounded-l-md bg-gray-700 border-none text-white"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  )
}
