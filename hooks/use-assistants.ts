"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

interface Assistant {
  id: string
  name: string
  description: string
  avatar_url?: string
  category?: string
  subscription_type: "free" | "premium" | "per_assistant"
  openai_assistant_id: string
  created_at: string
  active: boolean
}

// Mock data for development
const mockAssistants: Assistant[] = [
  {
    id: "1",
    name: "Code Assistant",
    description: "Expert programming assistant that helps with coding, debugging, and software architecture.",
    category: "Development",
    subscription_type: "free",
    openai_assistant_id: "asst_code_sample_id",
    created_at: new Date().toISOString(),
    active: true,
  },
  {
    id: "2",
    name: "Writing Coach",
    description: "Professional writing assistant for essays, articles, and creative content.",
    category: "Writing",
    subscription_type: "premium",
    openai_assistant_id: "asst_writing_sample_id",
    created_at: new Date().toISOString(),
    active: true,
  },
  {
    id: "3",
    name: "Data Analyst",
    description: "Specialized in data analysis, visualization, and statistical insights.",
    category: "Analytics",
    subscription_type: "per_assistant",
    openai_assistant_id: "asst_data_sample_id",
    created_at: new Date().toISOString(),
    active: true,
  },
  {
    id: "4",
    name: "Marketing Guru",
    description: "Expert in digital marketing, SEO, and content strategy.",
    category: "Marketing",
    subscription_type: "premium",
    openai_assistant_id: "asst_marketing_sample_id",
    created_at: new Date().toISOString(),
    active: true,
  },
  {
    id: "5",
    name: "Language Tutor",
    description: "Multilingual assistant for language learning and translation.",
    category: "Education",
    subscription_type: "free",
    openai_assistant_id: "asst_language_sample_id",
    created_at: new Date().toISOString(),
    active: true,
  },
  {
    id: "6",
    name: "Health Advisor",
    description: "General health and wellness guidance assistant.",
    category: "Health",
    subscription_type: "per_assistant",
    openai_assistant_id: "asst_health_sample_id",
    created_at: new Date().toISOString(),
    active: true,
  },
]

export function useAssistants() {
  const [assistants, setAssistants] = useState<Assistant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAssistants()
  }, [])

  const fetchAssistants = async () => {
    setLoading(true)
    setError(null)

    try {
      // Check if Supabase is properly configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        console.log("Supabase not configured, using mock data")
        setAssistants(mockAssistants)
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase
        .from("assistants")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false })

      if (error) {
        console.warn("Database error, falling back to mock data:", error.message)
        setAssistants(mockAssistants)
      } else {
        setAssistants(data || mockAssistants)
      }
    } catch (error) {
      console.warn("Error fetching assistants, using mock data:", error)
      setAssistants(mockAssistants)
      setError("Using demo data - configure Supabase for live data")
    } finally {
      setLoading(false)
    }
  }

  return { assistants, loading, error, refetch: fetchAssistants }
}
