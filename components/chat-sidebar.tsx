"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, MessageSquare, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Thread {
  id: string
  title: string
  created_at: string
  assistant: {
    name: string
    avatar_url?: string
  }
  last_message_at: string
}

interface ChatSidebarProps {
  threads: Thread[]
  currentThread?: Thread
  onThreadSelect: (thread: Thread) => void
  onNewChat: () => void
}

export function ChatSidebar({ threads, currentThread, onThreadSelect, onNewChat }: ChatSidebarProps) {
  return (
    <div className="h-full glass border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <Button onClick={onNewChat} className="w-full bg-[#dfff00] text-black hover:bg-[#dfff00]/90">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => onThreadSelect(thread)}
              className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                currentThread?.id === thread.id ? "bg-[#dfff00]/10 border border-[#dfff00]/30" : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={thread.assistant.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{thread.assistant.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium truncate">{thread.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle delete
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <p className="text-xs text-gray-400 truncate">{thread.assistant.name}</p>

                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(thread.last_message_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {threads.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No conversations yet</p>
            <p className="text-gray-500 text-xs">Start a new chat to begin</p>
          </div>
        </div>
      )}
    </div>
  )
}
