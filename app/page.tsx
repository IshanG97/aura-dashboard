"use client"

import type React from "react"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    // Set dark mode by default
    if (typeof window !== "undefined") {
      document.documentElement.style.colorScheme = "dark"
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber) return

    setIsLoading(true)

    setTimeout(() => {
      try {
        if (typeof window !== "undefined" && window.sessionStorage) {
          window.sessionStorage.setItem("aura-phone", phoneNumber)
        }
      } catch (e) {
        console.log("Storage not available")
      }

      if (typeof window !== "undefined") {
        window.location.href = "/dashboard"
      }
    }, 1500)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (typeof window !== "undefined") {
      document.documentElement.style.colorScheme = !isDarkMode ? "dark" : "light"
    }
  }

  const theme = {
    bg: isDarkMode ? "#000000" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#000000",
    cardBg: isDarkMode ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.95)",
    border: isDarkMode ? "#1f2937" : "#e5e7eb",
    muted: isDarkMode ? "#cbd5e1" : "#6b7280",
    input: isDarkMode ? "#000000" : "#ffffff",
    inputBorder: isDarkMode ? "#374151" : "#d1d5db",
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        transition: "all 0.3s ease",
      }}
    >
      {/* Dark Mode Toggle */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          zIndex: 10,
        }}
      >
        <button
          onClick={toggleDarkMode}
          style={{
            backgroundColor: "transparent",
            border: `1px solid ${theme.border}`,
            color: theme.text,
            padding: "0.5rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "1.25rem",
            transition: "all 0.3s ease",
          }}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "1rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "28rem",
            margin: "2rem auto",
          }}
        >
          {/* Logo Section */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                width: "8rem",
                height: "8rem",
                borderRadius: "1.5rem",
                margin: "0 auto 1rem",
                overflow: "hidden",
                backgroundColor: theme.border,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isDarkMode ? "0 4px 6px rgba(0, 0, 0, 0.3)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Gq4idemnRwRydm5Cw7Ciwwonpa0eji.png"
                alt="Aura Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = `
                      <div style="
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #2dd4bf, #22d3ee);
                        color: white;
                        font-size: 2rem;
                        font-weight: bold;
                      ">
                        A
                      </div>
                    `
                  }
                }}
              />
            </div>
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #2dd4bf, #22d3ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.5rem",
                margin: "0 0 0.5rem 0",
              }}
            >
              Aura
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                color: theme.muted,
                marginBottom: "2rem",
                margin: "0 0 2rem 0",
              }}
            >
              Your Personal Wellbeing Coach
            </p>
          </div>

          {/* Main Card */}
          <div
            style={{
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.cardBg,
              borderRadius: "0.75rem",
              padding: "2rem",
              boxShadow: isDarkMode ? "0 10px 25px rgba(0, 0, 0, 0.3)" : "0 10px 25px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: theme.text,
                textAlign: "center",
                marginBottom: "0.5rem",
                margin: "0 0 0.5rem 0",
              }}
            >
              Subscribe to a better you
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: theme.muted,
                textAlign: "center",
                marginBottom: "1.5rem",
                margin: "0 0 1.5rem 0",
              }}
            >
              Get personalized wellbeing guidance through WhatsApp
            </p>

            {/* Features */}
            <div style={{ marginBottom: "1.5rem" }}>
              {[
                { icon: "💬", text: "24/7 WhatsApp wellness coach" },
                { icon: "❤️", text: "Personalized health tracking" },
                { icon: "🛡️", text: "Support for consistent health habits" },
              ].map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.75rem",
                    fontSize: "0.875rem",
                    color: theme.muted,
                    padding: "0.5rem 0",
                  }}
                >
                  <span style={{ fontSize: "1.25rem", minWidth: "1.5rem" }}>{feature.icon}</span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="phone"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: theme.text,
                    marginBottom: "0.5rem",
                  }}
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{
                    width: "100%",
                    height: "3rem",
                    fontSize: "1rem",
                    backgroundColor: theme.input,
                    border: `1px solid ${theme.inputBorder}`,
                    color: theme.text,
                    borderRadius: "0.5rem",
                    padding: "0 0.75rem",
                    marginBottom: "1rem",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#2dd4bf"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.inputBorder
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  height: "3rem",
                  fontSize: "1.125rem",
                  background: isLoading || !phoneNumber ? "#6b7280" : "linear-gradient(135deg, #14b8a6, #06b6d4)",
                  color: "#ffffff",
                  fontWeight: "600",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: isLoading || !phoneNumber ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  transform: isLoading || !phoneNumber ? "none" : "translateY(0)",
                }}
                disabled={isLoading || !phoneNumber}
                onMouseEnter={(e) => {
                  if (!isLoading && phoneNumber) {
                    e.currentTarget.style.transform = "translateY(-1px)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(20, 184, 166, 0.4)"
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                {isLoading ? (
                  <>
                    <div
                      style={{
                        width: "1rem",
                        height: "1rem",
                        border: "2px solid #ffffff",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        marginRight: "0.5rem",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Connecting...
                  </>
                ) : (
                  "Start Your Journey"
                )}
              </button>
            </form>

            <p
              style={{
                fontSize: "0.75rem",
                color: theme.muted,
                textAlign: "center",
                marginTop: "1rem",
                margin: "1rem 0 0 0",
              }}
            >
              By subscribing, you agree to receive WhatsApp messages from Aura
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
