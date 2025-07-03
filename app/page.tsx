import { AssistantCatalog } from "@/components/assistant-catalog"
import { Header } from "@/components/header"
import { DemoBanner } from "@/components/demo-banner"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <DemoBanner />
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Clyrai Platform
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover and chat with custom AI assistants powered by OpenAI
          </p>
        </div>
        <AssistantCatalog />
      </main>
    </div>
  )
}
