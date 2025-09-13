import { config } from "./config"

export interface MessageData {
  message_id?: string
  sender_wa_id: string
  sender_name: string
  timestamp?: string
  type?: string
  text?: string
  audio_id?: string
  raw?: any
}

export function extractMessageData(payload: any): MessageData | null {
  try {
    const value = payload?.entry?.[0]?.changes?.[0]?.value
    const message = value?.messages?.[0] || {}
    const contact = value?.contacts?.[0] || {}
    const messageType = message.type

    return {
      sender_wa_id: message.from,
      sender_name: contact.profile?.name || "Unknown",
      message_id: message.id,
      timestamp: message.timestamp,
      type: messageType,
      text: messageType === "text" ? message.text?.body : null,
      audio_id: messageType === "audio" ? message.audio?.id : null,
      raw: message,
    }
  } catch (error) {
    console.error("⚠️ Error extracting message:", error)
    return null
  }
}

export async function sendTextMessage(toNumber: string, message: string) {
  const url = `https://graph.facebook.com/v22.0/${config.PHONE_NUMBER_ID}/messages`

  const payload = {
    messaging_product: "whatsapp",
    to: toNumber,
    type: "text",
    text: { body: message },
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    console.log("📤 Status:", response.status)
    console.log("📤 Response:", result)
    return result
  } catch (error) {
    console.error("Error sending text message:", error)
    throw error
  }
}

export async function sendAudioMessage(toNumber: string, mediaId: string) {
  const url = `https://graph.facebook.com/v22.0/${config.PHONE_NUMBER_ID}/messages`

  const payload = {
    messaging_product: "whatsapp",
    to: toNumber,
    type: "audio",
    audio: { id: mediaId },
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    console.log("📤 Audio message sent:", response.status, result)
    return result
  } catch (error) {
    console.error("Error sending audio message:", error)
    throw error
  }
}
