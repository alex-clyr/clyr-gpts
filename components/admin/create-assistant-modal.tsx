"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface CreateAssistantModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateAssistantModal({ open, onOpenChange, onSuccess }: CreateAssistantModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subscription_type: "free",
    openai_assistant_id: "",
    avatar_url: "",
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("assistants").insert([formData])

      if (error) throw error

      toast({
        title: "Success",
        description: "Assistant created successfully",
      })

      onSuccess()
      onOpenChange(false)
      setFormData({
        name: "",
        description: "",
        category: "",
        subscription_type: "free",
        openai_assistant_id: "",
        avatar_url: "",
      })
    } catch (error) {
      console.error("Error creating assistant:", error)
      toast({
        title: "Error",
        description: "Failed to create assistant",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Assistant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="glass border-white/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="glass border-white/20"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="glass border-white/20"
              placeholder="e.g., Development, Writing, Analytics"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscription_type">Subscription Type</Label>
            <Select
              value={formData.subscription_type}
              onValueChange={(value) => setFormData({ ...formData, subscription_type: value })}
            >
              <SelectTrigger className="glass border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="per_assistant">Per Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="openai_assistant_id">OpenAI Assistant ID</Label>
            <Input
              id="openai_assistant_id"
              value={formData.openai_assistant_id}
              onChange={(e) => setFormData({ ...formData, openai_assistant_id: e.target.value })}
              className="glass border-white/20"
              placeholder="asst_..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_url">Avatar URL (Optional)</Label>
            <Input
              id="avatar_url"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              className="glass border-white/20"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="glass border-white/20"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#dfff00] text-black hover:bg-[#dfff00]/90">
              {loading ? "Creating..." : "Create Assistant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
