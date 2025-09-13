import { type NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"
import { extractMessageData, sendTextMessage, sendAudioMessage } from "@/lib/messages"
import { appendHealthLog } from "@/lib/log"
import { generateLLMResponse, getIntent } from "@/lib/llm"
import {
  downloadWhatsAppAudio,
  transcribeAudio,
  generateVoiceWithOpenAI,
  uploadAudioToWhatsApp,
  cleanupTempFile,
} from "@/lib/audio"

// In-memory set to track processed messages
const PROCESSED_MESSAGE_IDS = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📦 Incoming webhook payload:", JSON.stringify(body, null, 2))

    const messageData = extractMessageData(body)
    const messageId = messageData?.message_id

    if (!messageId) {
      return NextResponse.json({ status: "ignored (no message id)" })
    }

    if (PROCESSED_MESSAGE_IDS.has(messageId)) {
      console.log("⚠️ Duplicate message ignored:", messageId)
      return NextResponse.json({ status: "ignored (duplicate message)" })
    }

    PROCESSED_MESSAGE_IDS.add(messageId)

    if (messageData) {
      let userText: string
      let audioPath: string | null = null

      if (messageData.audio_id) {
        // Download and transcribe audio using OpenAI Whisper
        console.log("🎤 Processing audio message:", messageData.audio_id)
        audioPath = await downloadWhatsAppAudio(messageData.audio_id)
        userText = await transcribeAudio(audioPath)
        console.log("🎤 Whisper transcribed text:", userText)
      } else if (messageData.text) {
        userText = messageData.text
      } else {
        return NextResponse.json({ status: "ignored (no valid input)" })
      }

      // Save the user incoming message into history
      const logEntry = {
        timestamp: new Date().toISOString(),
        sender: messageData.sender_wa_id,
        name: messageData.sender_name,
        message: userText,
        role: "user" as const,
      }

      appendHealthLog(logEntry)
      console.log("📥 Received message:", logEntry)

      // Generate LLM response using OpenAI
      console.log("🧠 Generating LLM response for user:", logEntry.sender)
      const [reply, history] = await generateLLMResponse(logEntry.sender)

      // Check for intent (reminders/goals)
      const historyText = history.map((h) => `${h.role}: ${h.message}`).join("\n")
      const intent = await getIntent(historyText)

      if (intent.type) {
        console.log("🎯 Detected intent:", intent)
        // Here you could save reminders/goals to a database
        // For now, we'll just log it
      }

      // Save the LLM response into history
      const assistantEntry = {
        timestamp: new Date().toISOString(),
        sender: messageData.sender_wa_id,
        name: "Aura",
        message: reply,
        role: "assistant" as const,
      }

      appendHealthLog(assistantEntry)
      console.log("🧠 LLM response generated:", assistantEntry)

      // Send text reply
      await sendTextMessage(messageData.sender_wa_id, reply)

      // Generate + send voice message if original was audio and OpenAI is configured
      if (messageData.audio_id && config.OPENAI_API_KEY) {
        let voicePath: string | null = null
        try {
          console.log("🔊 Generating voice response with OpenAI TTS...")
          voicePath = await generateVoiceWithOpenAI(reply, "alloy") // You can change voice: alloy, echo, fable, onyx, nova, shimmer
          const mediaId = await uploadAudioToWhatsApp(voicePath)
          await sendAudioMessage(messageData.sender_wa_id, mediaId)
          console.log("🔊 Voice message sent successfully")
        } catch (error) {
          console.error("Error sending voice message:", error)
        } finally {
          // Clean up voice file
          if (voicePath) {
            cleanupTempFile(voicePath)
          }
        }
      }

      // Clean up downloaded audio file
      if (audioPath) {
        cleanupTempFile(audioPath)
      }

      console.log("📤 Reply sent to user:", messageData.sender_wa_id)
    }

    return NextResponse.json({ status: "received" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const hubMode = searchParams.get("hub.mode")
  const hubChallenge = searchParams.get("hub.challenge")
  const hubVerifyToken = searchParams.get("hub.verify_token")

  const expected = config.WEBHOOK_VERIFICATION_TOKEN
  console.log(`📡 Received token: '${hubVerifyToken}' | Expected: '${expected}'`)

  if (hubMode === "subscribe" && hubVerifyToken === expected) {
    return new Response(hubChallenge, { status: 200 })
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 })
}
