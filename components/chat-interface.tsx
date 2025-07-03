"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Plus, Menu } from "lucide-react"
import { useChat } from "@/hooks/use-chat"
import { useAuth } from "@/components/auth-provider"
import { ChatSidebar } from "@/components/chat-sidebar"
import { NewChatModal } from "@/components/new-chat-modal"
import { FileUpload } from "@/components/file-upload"

export function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [newChatModalOpen, setNewChatModalOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { user } = useAuth()
  const { messages, currentThread, currentAssistant, sendMessage, loading, threads, switchThread } = useChat()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim() && files.length === 0) return

    await sendMessage(message, files)
    setMessage("")
    setFiles([])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden`}>
        <ChatSidebar
          threads={threads}
          currentThread={currentThread}
          onThreadSelect={switchThread}
          onNewChat={() => setNewChatModalOpen(true)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="glass border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-4 w-4" />
            </Button>

            {currentAssistant && (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentAssistant.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{currentAssistant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{currentAssistant.name}</h2>
                  <p className="text-xs text-gray-400">AI Assistant</p>
                </div>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setNewChatModalOpen(true)}
            className="glass border-white/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === "user" ? "bg-[#dfff00] text-black" : "glass-card"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {msg.files && msg.files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.files.map((file, index) => (
                        <div key={index} className="text-xs opacity-70">
                          📎 {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="glass-card rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#dfff00]"></div>
                    <span className="text-sm text-gray-400">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="glass border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            {files.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <div key={index} className="glass-card rounded-lg px-3 py-1 text-sm flex items-center space-x-2">
                    <span>📎 {file.name}</span>
                    <button
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end space-x-2">
              <FileUpload onFilesSelected={setFiles} />

              <div className="flex-1">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="glass border-white/20 resize-none"
                  disabled={loading || !currentThread}
                />
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={loading || (!message.trim() && files.length === 0) || !currentThread}
                className="bg-[#dfff00] text-black hover:bg-[#dfff00]/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <NewChatModal open={newChatModalOpen} onOpenChange={setNewChatModalOpen} />
    </div>
  )
}
