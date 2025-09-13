import { getHealthLog, type LogEntry } from "./log"
import { config } from "./config"

interface TasksModel {
  task_type: string
  content: string
}

const tools = [
  {
    type: "function" as const,
    function: {
      name: "create_reminder",
      description: "create reminder for user (to be scheduled daily, or multiple times a day)",
      parameters: {
        type: "object",
        properties: {
          content: {
            type: "string",
            description: "Reminder content (e.g, `Take 10k steps`)",
          },
        },
        additionalProperties: false,
        required: ["content"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "create_goal",
      description: "create goal for user (to be completed)",
      parameters: {
        type: "object",
        properties: {
          content: {
            type: "string",
            description: "goal content (e.g, `run 10k`)",
          },
        },
        additionalProperties: false,
        required: ["content"],
      },
    },
  },
]

function buildHistory(logs: LogEntry[]): string {
  return logs.map((l) => `${l.role === "user" ? "You" : "Aura"}: ${l.message}`).join("\n")
}

export async function generateLLMResponse(userId: string): Promise<[string, LogEntry[]]> {
  try {
    // Get conversation history for this user
    const allLogs = getHealthLog()
    const userLogs = allLogs.filter((l) => l.sender === userId)

    // Use last 20 entries from conversation
    const recentLogs = userLogs.slice(-20)

    // Build conversation history
    const history = buildHistory(recentLogs)

    const messages = [
      {
        role: "system" as const,
        content:
          "You are Aura, a personalized, empathetic, WhatsApp-based wellness coach. Your mission is to guide users toward sustainable health habits through tailored micro-actions, delivered as concise, engaging WhatsApp messages. Your tone is warm, supportive, and never clinical, adapting to the user's personality archetype. You celebrate small wins, offer gentle support for setbacks, and NEVER provide medical advice. Your goal is to foster positive, achievable micro-habits that align with the user's health goals. Also, don't add words like 'Aura:' in the beginning of your responses.",
      },
      {
        role: "user" as const,
        content: history || "Hello",
      },
    ]

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        tools,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const assistantMessage = data.choices[0]?.message?.content || "I'm here to help with your wellness journey!"

    return [assistantMessage, recentLogs]
  } catch (error) {
    console.error("Error generating LLM response:", error)
    // Fallback response
    const fallbackResponses = [
      "Thanks for sharing! How are you feeling today?",
      "That's great to hear! Keep up the good work with your wellness journey.",
      "I understand. Remember, every small step counts towards better health.",
      "How can I help you with your wellness goals today?",
      "That sounds like progress! What would you like to focus on next?",
    ]

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    const userLogs = getHealthLog(userId)
    return [randomResponse, userLogs]
  }
}

export async function getIntent(history: string): Promise<Record<string, any>> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You have been given a chat history between an agent and a customer. You have to determine whether the user wants to create a task (either a reminder or a goal) or not. return a parsable json (not markdown, it must be parsable) with this structure {'type': <'reminder' / 'goal'>, 'content':<action content of task>} if there's no task, return empty json {}",
          },
          {
            role: "user",
            content: history,
          },
        ],
        temperature: 0.1,
        max_tokens: 100,
      }),
    })

    if (!response.ok) {
      return {}
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || "{}"

    try {
      return JSON.parse(content)
    } catch {
      return {}
    }
  } catch (error) {
    console.error("Error getting intent:", error)
    return {}
  }
}
