import fs from "fs"
import path from "path"

const LOG_FILE = path.join(process.cwd(), "health_log.json")

export interface LogEntry {
  timestamp: string
  sender: string
  name: string
  message: string
  role: "user" | "assistant"
}

export function appendHealthLog(entry: LogEntry) {
  try {
    let logs: LogEntry[] = []

    // Read existing logs
    if (fs.existsSync(LOG_FILE)) {
      const data = fs.readFileSync(LOG_FILE, "utf8")
      logs = JSON.parse(data)
    }

    // Append new entry
    logs.push(entry)

    // Write back to file
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2))
  } catch (error) {
    console.error("Error appending to health log:", error)
  }
}

export function getHealthLog(sender?: string): LogEntry[] {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      return []
    }

    const data = fs.readFileSync(LOG_FILE, "utf8")
    const logs: LogEntry[] = JSON.parse(data)

    if (sender) {
      return logs.filter((log) => log.sender === sender)
    }

    return logs
  } catch (error) {
    console.error("Error reading health log:", error)
    return []
  }
}
