import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { threadId, assistantId, message, files } = await request.json()

    // Add message to thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
      // Add file attachments if any
      ...(files &&
        files.length > 0 && {
          attachments: files.map((file: any) => ({
            file_id: file.url, // This would need to be uploaded to OpenAI first
            tools: [{ type: "file_search" }],
          })),
        }),
    })

    // Run the assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    })

    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)

    while (runStatus.status === "in_progress" || runStatus.status === "queued") {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)
    }

    if (runStatus.status === "completed") {
      // Get the assistant's response
      const messages = await openai.beta.threads.messages.list(threadId)
      const lastMessage = messages.data[0]

      if (lastMessage.role === "assistant" && lastMessage.content[0].type === "text") {
        return NextResponse.json({
          message: lastMessage.content[0].text.value,
        })
      }
    }

    return NextResponse.json({ error: "Failed to get response from assistant" }, { status: 500 })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
