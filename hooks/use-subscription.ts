"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

export function useSubscription(assistantId?: string) {
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      setHasAccess(false)
      setLoading(false)
      return
    }

    checkAccess()
  }, [user, assistantId])

  const checkAccess = async () => {
    if (!user || !assistantId) {
      setLoading(false)
      return
    }

    try {
      // Check for active subscriptions
      const { data: subscriptions, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")

      if (error) {
        console.error("Error checking subscription:", error)
        // For development, allow access to free assistants
        setHasAccess(true)
        setLoading(false)
        return
      }

      // Check if user has universal access or specific assistant access
      const hasUniversalAccess = subscriptions?.some((sub) => sub.type === "universal")
      const hasAssistantAccess = subscriptions?.some(
        (sub) => sub.type === "per_assistant" && sub.assistant_id === assistantId,
      )

      setHasAccess(hasUniversalAccess || hasAssistantAccess)
    } catch (error) {
      console.error("Error checking subscription:", error)
      // For development, allow access
      setHasAccess(true)
    } finally {
      setLoading(false)
    }
  }

  return { hasAccess, loading, refetch: checkAccess }
}
