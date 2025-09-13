import { type NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    const { to_number } = await request.json()

    const url = `https://graph.facebook.com/v22.0/${config.PHONE_NUMBER_ID}/messages`
    const payload = {
      messaging_product: "whatsapp",
      to: to_number,
      type: "template",
      template: {
        name: "aura_welcome",
        language: {
          code: "en",
        },
      },
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    console.log("📤 Onboarding status:", response.status)
    console.log("📤 Onboarding response:", result)

    return NextResponse.json(result, { status: response.status })
  } catch (error) {
    console.error("Error sending onboarding message:", error)
    return NextResponse.json({ error: "Failed to send onboarding message" }, { status: 500 })
  }
}
