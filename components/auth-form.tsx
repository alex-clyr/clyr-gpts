"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, User, AlertCircle } from "lucide-react"

interface AuthFormProps {
  mode: "signin" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, signUp, signInWithGoogle, isConfigured } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === "signin") {
        await signIn(email, password)
      } else {
        await signUp(email, password, name)
      }
      router.push("/")
    } catch (error: any) {
      console.error("Auth error:", error)
      setError(error.message || "An error occurred during authentication")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (error: any) {
      console.error("Google sign in error:", error)
      setError(error.message || "An error occurred during Google sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card rounded-xl p-8">
      {!isConfigured && (
        <Alert className="mb-6 border-[#dfff00]/20 bg-[#dfff00]/10">
          <AlertCircle className="h-4 w-4 text-[#dfff00]" />
          <AlertDescription className="text-[#dfff00]">
            <strong>Demo Mode:</strong> Authentication is not available. Please configure Supabase to enable sign up and
            sign in.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-6 border-red-500/20 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 glass border-white/20"
                required
                disabled={!isConfigured}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 glass border-white/20"
              required
              disabled={!isConfigured}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 glass border-white/20"
              required
              disabled={!isConfigured}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#dfff00] text-black hover:bg-[#dfff00]/90"
          disabled={loading || !isConfigured}
        >
          {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-4 glass border-white/20 bg-transparent"
          onClick={handleGoogleSignIn}
          disabled={loading || !isConfigured}
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>
      </div>

      <div className="mt-6 text-center text-sm">
        {mode === "signin" ? (
          <p className="text-gray-400">
            {"Don't have an account? "}
            <Link href="/auth/signup" className="text-[#dfff00] hover:underline">
              Sign up
            </Link>
          </p>
        ) : (
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-[#dfff00] hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>

      {!isConfigured && (
        <div className="mt-6 text-center">
          <Link href="/" className="text-[#dfff00] hover:underline text-sm">
            ← Back to Demo
          </Link>
        </div>
      )}
    </div>
  )
}
