"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { useAssistants } from "@/hooks/use-assistants"
import { CreateAssistantModal } from "./create-assistant-modal"

export function AssistantManager() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const { assistants, loading, refetch } = useAssistants()

  const getSubscriptionBadge = (type: string) => {
    switch (type) {
      case "free":
        return <Badge className="bg-green-600">Free</Badge>
      case "premium":
        return <Badge className="bg-[#dfff00] text-black">Premium</Badge>
      case "per_assistant":
        return (
          <Badge variant="outline" className="border-orange-400 text-orange-400">
            Per Assistant
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="glass-card animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Assistant Management</h2>
          <p className="text-gray-400">Create and manage your AI assistants</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} className="bg-[#dfff00] text-black hover:bg-[#dfff00]/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Assistant
        </Button>
      </div>

      <div className="grid gap-4">
        {assistants.map((assistant) => (
          <Card key={assistant.id} className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={assistant.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{assistant.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg">{assistant.name}</h3>
                      {getSubscriptionBadge(assistant.subscription_type)}
                      {assistant.category && <Badge variant="secondary">{assistant.category}</Badge>}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{assistant.description}</p>
                    <p className="text-xs text-gray-500">OpenAI ID: {assistant.openai_assistant_id}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="glass border-white/20 bg-transparent">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="glass border-white/20 bg-transparent">
                    {assistant.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" className="glass border-red-500/20 text-red-400 bg-transparent">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateAssistantModal open={createModalOpen} onOpenChange={setCreateModalOpen} onSuccess={refetch} />
    </div>
  )
}
