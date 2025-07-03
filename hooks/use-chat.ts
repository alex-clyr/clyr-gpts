"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { useSearchParams } from "next/navigation"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  files?: { name: string; url: string }[]
  created_at: string
}

interface Thread {
  id: string
  title: string
  assistant_id: string
  openai_thread_id: string
  created_at: string
  last_message_at: string
  assistant: {
    id: string
    name: string
    avatar_url?: string
    openai_assistant_id: string
  }
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [threads, setThreads] = useState<Thread[]>([])
  const [currentThread, setCurrentThread] = useState<Thread | null>(null)
  const [currentAssistant, setCurrentAssistant] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()
  const supabase = createClient()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (user) {
      fetchThreads()

      // Check if there's an assistant parameter in the URL
      const assistantId = searchParams.get("assistant")
      if (assistantId) {
        createNewThread(assistantId)
      }
    }
  }, [user, searchParams])

  const fetchThreads = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("chat_threads")
        .select(`
          *,
          assistant:assistants(*)
        `)
        .eq("user_id", user.id)
        .order("last_message_at", { ascending: false })

      if (error) {
        console.error("Error fetching threads:", error)
        return
      }
      setThreads(data || [])
    } catch (error) {
      console.error("Error fetching threads:", error)
    }
  }

  const createNewThread = async (assistantId: string) => {
    if (!user) return

    try {
      // First get the assistant details from our mock data or database
      const mockAssistants = [
        {
          id: "1",
          name: "Code Assistant",
          openai_assistant_id: "asst_code_sample_id",
          avatar_url: "/placeholder.svg",
        },
        {
          id: "2",
          name: "Writing Coach",
          openai_assistant_id: "asst_writing_sample_id",
          avatar_url: "/placeholder.svg",
        },
        {
          id: "3",
          name: "Data Analyst",
          openai_assistant_id: "asst_data_sample_id",
          avatar_url: "/placeholder.svg",
        },
      ]

      const assistant = mockAssistants.find((a) => a.id === assistantId)
      if (!assistant) return

      // Create a mock thread for development
      const mockThread = {
        id: `thread_${Date.now()}`,
        title: `Chat with ${assistant.name}`,
        assistant_id: assistantId,
        openai_thread_id: `thread_${Date.now()}`,
        created_at: new Date().toISOString(),
        last_message_at: new Date().toISOString(),
        assistant: assistant,
      }

      setCurrentThread(mockThread)
      setCurrentAssistant(assistant)
      setMessages([])
      setThreads((prev) => [mockThread, ...prev])
    } catch (error) {
      console.error("Error creating thread:", error)
    }
  }

  const switchThread = async (thread: Thread) => {
    setCurrentThread(thread)
    setCurrentAssistant(thread.assistant)
    await fetchMessages(thread.id)
  }

  const fetchMessages = async (threadId: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching messages:", error)
        return
      }
      setMessages(data || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const sendMessage = async (content: string, files: File[] = []) => {
    if (!currentThread || !user) return

    setLoading(true)

    try {
      // Create user message
      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        role: "user",
        content,
        files: files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })),
        created_at: new Date().toISOString(),
      }

      // Add user message to state
      setMessages((prev) => [...prev, userMessage])

      // Simulate assistant response for development
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `msg_${Date.now() + 1}`,
          role: "assistant",
          content: `Thank you for your message: "${content}". This is a simulated response from ${currentAssistant?.name}. To get real AI responses, please configure your OpenAI API key and set up the backend integration.`,
          created_at: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error sending message:", error)
      setLoading(false)
    }
  }

  return {
    messages,
    threads,
    currentThread,
    currentAssistant,
    loading,
    sendMessage,
    createNewThread,
    switchThread,
  }
}
