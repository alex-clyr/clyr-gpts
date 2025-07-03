"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export function DemoBanner() {
  const { isConfigured } = useAuth()

  if (isConfigured) return null

  return (
    <Alert className="mb-4 border-[#dfff00]/20 bg-[#dfff00]/10">
      <Info className="h-4 w-4 text-[#dfff00]" />
      <AlertDescription className="text-[#dfff00]">
        <strong>Demo Mode:</strong> This is a preview with sample data. Configure Supabase to enable full functionality.
      </AlertDescription>
    </Alert>
  )
}
