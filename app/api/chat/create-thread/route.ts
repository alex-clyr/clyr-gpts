import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { assistantId } = await request.json()

    const thread = await openai.beta.threads.create()

    return NextResponse.json({ threadId: thread.id })
  } catch (error) {
    console.error("Error creating thread:", error)
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 })
  }
}
