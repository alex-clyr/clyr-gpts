import { AuthForm } from "@/components/auth-form"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Get Started</h1>
          <p className="text-gray-400">Create your Clyrai account</p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </div>
  )
}
