import { ChatInterface } from "@/components/chat-interface"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"

export default async function ChatPage() {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/auth/signin")
    }

    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <ChatInterface />
      </div>
    )
  } catch (error) {
    console.error("Error in chat page:", error)
    redirect("/auth/signin")
  }
}
