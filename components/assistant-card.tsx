"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Lock, Crown } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useSubscription } from "@/hooks/use-subscription"

interface Assistant {
  id: string
  name: string
  description: string
  avatar_url?: string
  category?: string
  subscription_type: "free" | "premium" | "per_assistant"
  openai_assistant_id: string
}

interface AssistantCardProps {
  assistant: Assistant
}

export function AssistantCard({ assistant }: AssistantCardProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { hasAccess, loading } = useSubscription(assistant.id)
  const [imageError, setImageError] = useState(false)

  const handleChatClick = () => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    if (assistant.subscription_type !== "free" && !hasAccess) {
      router.push(`/subscribe/${assistant.id}`)
      return
    }

    router.push(`/chat?assistant=${assistant.id}`)
  }

  const getSubscriptionIcon = () => {
    switch (assistant.subscription_type) {
      case "premium":
        return <Crown className="h-4 w-4 text-[#dfff00]" />
      case "per_assistant":
        return <Lock className="h-4 w-4 text-orange-400" />
      default:
        return null
    }
  }

  return (
    <div
      className="glass-card rounded-xl p-6 hover:bg-white/5 transition-all duration-300 group cursor-pointer"
      onClick={handleChatClick}
    >
      <div className="flex items-start space-x-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#dfff00]/20 to-yellow-600/20 flex items-center justify-center">
            {assistant.avatar_url && !imageError ? (
              <Image
                src={assistant.avatar_url || "/placeholder.svg"}
                alt={assistant.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-2xl font-bold text-[#dfff00]">{assistant.name.charAt(0)}</span>
            )}
          </div>
          {getSubscriptionIcon() && (
            <div className="absolute -top-1 -right-1 bg-gray-800 rounded-full p-1">{getSubscriptionIcon()}</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg truncate group-hover:text-[#dfff00] transition-colors">
              {assistant.name}
            </h3>
          </div>

          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{assistant.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {assistant.category && (
                <Badge variant="secondary" className="text-xs">
                  {assistant.category}
                </Badge>
              )}
              <Badge
                variant={assistant.subscription_type === "free" ? "default" : "outline"}
                className={
                  assistant.subscription_type === "free"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-[#dfff00] text-[#dfff00]"
                }
              >
                {assistant.subscription_type === "free" ? "Free" : "Premium"}
              </Badge>
            </div>

            <Button
              size="sm"
              className="bg-[#dfff00] text-black hover:bg-[#dfff00]/90 opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={loading}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
