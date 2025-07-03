"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAssistants } from "@/hooks/use-assistants"
import { useChat } from "@/hooks/use-chat"
import { useSubscription } from "@/hooks/use-subscription"
import { Lock, Crown } from "lucide-react"

interface NewChatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewChatModal({ open, onOpenChange }: NewChatModalProps) {
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(null)
  const { assistants, loading } = useAssistants()
  const { createNewThread } = useChat()

  const handleStartChat = async () => {
    if (!selectedAssistant) return

    await createNewThread(selectedAssistant)
    onOpenChange(false)
    setSelectedAssistant(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-2xl">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {assistants.map((assistant) => (
            <AssistantOption
              key={assistant.id}
              assistant={assistant}
              selected={selectedAssistant === assistant.id}
              onSelect={() => setSelectedAssistant(assistant.id)}
            />
          ))}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleStartChat}
            disabled={!selectedAssistant}
            className="bg-[#dfff00] text-black hover:bg-[#dfff00]/90"
          >
            Start Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AssistantOption({
  assistant,
  selected,
  onSelect,
}: {
  assistant: any
  selected: boolean
  onSelect: () => void
}) {
  const { hasAccess } = useSubscription(assistant.id)
  const canAccess = assistant.subscription_type === "free" || hasAccess

  return (
    <div
      onClick={canAccess ? onSelect : undefined}
      className={`p-4 rounded-lg border transition-all cursor-pointer ${
        selected
          ? "border-[#dfff00] bg-[#dfff00]/10"
          : canAccess
            ? "border-white/20 hover:border-white/40 hover:bg-white/5"
            : "border-white/10 opacity-50 cursor-not-allowed"
      }`}
    >
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={assistant.avatar_url || "/placeholder.svg"} />
          <AvatarFallback>{assistant.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium">{assistant.name}</h3>
            {assistant.subscription_type === "premium" && <Crown className="h-4 w-4 text-[#dfff00]" />}
            {assistant.subscription_type === "per_assistant" && <Lock className="h-4 w-4 text-orange-400" />}
          </div>

          <p className="text-sm text-gray-400 mb-2">{assistant.description}</p>

          <div className="flex items-center space-x-2">
            <Badge
              variant={assistant.subscription_type === "free" ? "default" : "outline"}
              className={assistant.subscription_type === "free" ? "bg-green-600" : "border-[#dfff00] text-[#dfff00]"}
            >
              {assistant.subscription_type === "free" ? "Free" : "Premium"}
            </Badge>

            {!canAccess && <Badge variant="destructive">Subscription Required</Badge>}
          </div>
        </div>
      </div>
    </div>
  )
}
