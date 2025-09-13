import { config } from "./config"
import fs from "fs"
import path from "path"

export async function downloadWhatsAppAudio(mediaId: string): Promise<string> {
  try {
    // Step 1: Get the media download URL
    const mediaUrl = `https://graph.facebook.com/v22.0/${mediaId}`
    const response = await fetch(mediaUrl, {
      headers: {
        Authorization: `Bearer ${config.WHATSAPP_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get media URL: ${response.status}`)
    }

    const mediaData = await response.json()
    const downloadUrl = mediaData.url

    // Step 2: Download the media bytes
    const audioResponse = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${config.WHATSAPP_TOKEN}`,
      },
    })

    if (!audioResponse.ok) {
      throw new Error(`Failed to download audio: ${audioResponse.status}`)
    }

    const audioBuffer = await audioResponse.arrayBuffer()
    const tempDir = path.join(process.cwd(), "temp")

    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const audioPath = path.join(tempDir, `${mediaId}.ogg`)
    fs.writeFileSync(audioPath, Buffer.from(audioBuffer))

    return audioPath
  } catch (error) {
    console.error("Error downloading WhatsApp audio:", error)
    throw error
  }
}

export async function transcribeAudio(filePath: string): Promise<string> {
  try {
    if (!config.OPENAI_API_KEY) {
      console.log("🎤 OpenAI API key not found, using placeholder transcription")
      return "Audio message received (transcription not available)"
    }

    // Read the audio file
    const audioBuffer = fs.readFileSync(filePath)
    const audioBlob = new Blob([audioBuffer], { type: "audio/ogg" })

    // Create form data for OpenAI Whisper API
    const formData = new FormData()
    formData.append("file", audioBlob, "audio.ogg")
    formData.append("model", "whisper-1")
    formData.append("language", "en") // Optional: specify language
    formData.append("response_format", "text")

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.OPENAI_API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenAI Whisper error:", response.status, errorText)
      throw new Error(`OpenAI Whisper error: ${response.status}`)
    }

    const transcription = await response.text()
    console.log("🎤 Whisper transcription:", transcription)

    return transcription || "Could not transcribe audio"
  } catch (error) {
    console.error("Error transcribing audio with Whisper:", error)
    return "Audio message received (transcription failed)"
  }
}

export async function generateVoiceWithOpenAI(text: string, voice = "alloy"): Promise<string> {
  try {
    if (!config.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured")
    }

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: voice, // Options: alloy, echo, fable, onyx, nova, shimmer
        response_format: "mp3",
        speed: 1.0,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenAI TTS error:", response.status, errorText)
      throw new Error(`OpenAI TTS error: ${response.status}`)
    }

    const audioBuffer = await response.arrayBuffer()
    const tempDir = path.join(process.cwd(), "temp")

    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const audioPath = path.join(tempDir, `voice_${Date.now()}.mp3`)
    fs.writeFileSync(audioPath, Buffer.from(audioBuffer))

    console.log("🔊 OpenAI TTS audio generated:", audioPath)
    return audioPath
  } catch (error) {
    console.error("Error generating voice with OpenAI TTS:", error)
    throw error
  }
}

export async function uploadAudioToWhatsApp(filePath: string): Promise<string> {
  try {
    const formData = new FormData()
    const audioBuffer = fs.readFileSync(filePath)
    const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" })

    formData.append("file", audioBlob, "audio.mp3")
    formData.append("messaging_product", "whatsapp")
    formData.append("type", "audio/mpeg")

    const response = await fetch(`https://graph.facebook.com/v22.0/${config.PHONE_NUMBER_ID}/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.WHATSAPP_TOKEN}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ WhatsApp upload failed:", response.status, errorText)
      throw new Error(`WhatsApp upload failed: ${response.status}`)
    }

    const result = await response.json()
    console.log("✅ Media upload response:", response.status, result)

    const mediaId = result.id
    if (!mediaId) {
      throw new Error("No media ID returned by WhatsApp")
    }

    return mediaId
  } catch (error) {
    console.error("Error uploading audio to WhatsApp:", error)
    throw error
  }
}

// Clean up temporary files
export function cleanupTempFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log("🧹 Cleaned up temp file:", filePath)
    }
  } catch (error) {
    console.error("Error cleaning up temp file:", error)
  }
}
