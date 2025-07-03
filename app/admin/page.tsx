import { AdminDashboard } from "@/components/admin-dashboard"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"

export default async function AdminPage() {
  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/auth/signin")
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", session.user.id).single()

    if (profile?.role !== "admin") {
      redirect("/")
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <AdminDashboard />
      </div>
    )
  } catch (error) {
    console.error("Error in admin page:", error)
    redirect("/")
  }
}
