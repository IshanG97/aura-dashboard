"use client"

import { useState, useEffect } from "react"

export default function DashboardPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    // Set dark mode by default
    if (typeof window !== "undefined") {
      document.documentElement.style.colorScheme = "dark"
    }

    // Get phone number from storage
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const storedPhone = window.sessionStorage.getItem("aura-phone")
        if (storedPhone) {
          setPhoneNumber(storedPhone)
        }
      }
    } catch (e) {
      console.log("Storage not available")
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (typeof window !== "undefined") {
      document.documentElement.style.colorScheme = !isDarkMode ? "dark" : "light"
    }
  }

  const goBack = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }

  const theme = {
    bg: isDarkMode ? "#000000" : "#f8fafc",
    text: isDarkMode ? "#ffffff" : "#1e293b",
    cardBg: isDarkMode ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.95)",
    headerBg: isDarkMode ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.95)",
    border: isDarkMode ? "#1f2937" : "#e2e8f0",
    muted: isDarkMode ? "#94a3b8" : "#64748b",
    accent: "#14b8a6",
    gradient: "linear-gradient(135deg, #14b8a6, #06b6d4)",
  }

  const metrics = [
    {
      title: "Sleep",
      icon: "🌙",
      current: 7.5,
      goal: 8,
      unit: "h",
      streak: 5,
      weeklyAvg: 7.2,
      progress: 94,
    },
    {
      title: "Meditate",
      icon: "🧘",
      current: 15,
      goal: 20,
      unit: "min",
      streak: 12,
      weeklyAvg: 18,
      progress: 75,
    },
    {
      title: "Workout",
      icon: "💪",
      current: 4,
      goal: 5,
      unit: " sessions",
      streak: 3,
      weeklyAvg: 3.8,
      progress: 80,
    },
  ]

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
      {/* Header */}
      <div
        style={{
          backgroundColor: theme.headerBg,
          borderBottom: `1px solid ${theme.border}`,
          padding: "1rem",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <button
              onClick={goBack}
              style={{
                color: theme.muted,
                backgroundColor: "transparent",
                border: "none",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.text
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.muted
              }}
            >
              ← Back
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  backgroundColor: theme.border,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                          font-size: 1rem;
                          font-weight: bold;
                        ">
                          A
                        </div>
                      `
                    }
                  }}
                />
              </div>
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: theme.text,
                  }}
                >
                  Aura Dashboard
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    color: theme.muted,
                  }}
                >
                  {phoneNumber || "Your wellness journey"}
                </p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              onClick={toggleDarkMode}
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${theme.border}`,
                color: theme.text,
                padding: "0.5rem",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 0.3s ease",
              }}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button
              style={{
                background: theme.gradient,
                color: "#ffffff",
                fontWeight: "600",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              💬 Open WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        {/* Welcome Section */}
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: theme.text,
              marginBottom: "0.5rem",
              margin: "0 0 0.5rem 0",
            }}
          >
            Welcome back!
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: theme.muted,
              margin: 0,
            }}
          >
            Here's your wellbeing progress for today
          </p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              borderRadius: "0.75rem",
              background: theme.gradient,
              color: "#ffffff",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontSize: "0.875rem", opacity: 0.8, margin: "0 0 0.25rem 0" }}>Total Score</p>
                <p style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>85%</p>
              </div>
              <div style={{ fontSize: "1.5rem" }}>✅</div>
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              borderRadius: "0.75rem",
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontSize: "0.875rem", color: theme.muted, margin: "0 0 0.25rem 0" }}>Active Streak</p>
                <p style={{ fontSize: "2rem", fontWeight: "bold", color: theme.accent, margin: 0 }}>12</p>
              </div>
              <div style={{ fontSize: "1.5rem" }}>🔥</div>
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              borderRadius: "0.75rem",
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontSize: "0.875rem", color: theme.muted, margin: "0 0 0.25rem 0" }}>This Week</p>
                <p style={{ fontSize: "2rem", fontWeight: "bold", color: theme.accent, margin: 0 }}>4/5</p>
              </div>
              <div style={{ fontSize: "1.5rem" }}>📅</div>
            </div>
          </div>
        </div>

        {/* Health Metrics */}
        <div>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: theme.text,
              marginBottom: "1.5rem",
              margin: "0 0 1.5rem 0",
            }}
          >
            Health Tracking
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            {metrics.map((metric, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        backgroundColor: theme.accent,
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                      }}
                    >
                      {metric.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        color: theme.text,
                        margin: 0,
                      }}
                    >
                      {metric.title}
                    </h3>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      backgroundColor: theme.border,
                      color: theme.muted,
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    📈 up
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.875rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: theme.muted }}>Progress</span>
                    <span style={{ color: theme.text, fontWeight: "500" }}>
                      {metric.current}
                      {metric.unit} / {metric.goal}
                      {metric.unit}
                    </span>
                  </div>
                  <div
                    style={{
                      height: "0.5rem",
                      backgroundColor: theme.border,
                      borderRadius: "9999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: theme.gradient,
                        borderRadius: "9999px",
                        width: `${metric.progress}%`,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "0.875rem",
                        color: theme.muted,
                        marginBottom: "0.25rem",
                      }}
                    >
                      <span>🏆</span>
                      <span>Streak</span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: theme.text,
                        margin: 0,
                      }}
                    >
                      {metric.streak} days
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "0.875rem",
                        color: theme.muted,
                        marginBottom: "0.25rem",
                      }}
                    >
                      <span>📊</span>
                      <span>Weekly Avg</span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: theme.text,
                        margin: 0,
                      }}
                    >
                      {metric.weeklyAvg}
                      {metric.unit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: theme.text,
              marginBottom: "1.5rem",
              margin: "0 0 1.5rem 0",
            }}
          >
            Quick Actions
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { icon: "🌙", label: "Log Sleep" },
              { icon: "🧘", label: "Start Meditation" },
              { icon: "💪", label: "Log Workout" },
            ].map((action, index) => (
              <button
                key={index}
                style={{
                  height: "4rem",
                  backgroundColor: "transparent",
                  border: `1px solid ${theme.border}`,
                  color: theme.muted,
                  borderRadius: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.accent
                  e.currentTarget.style.color = theme.text
                  e.currentTarget.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border
                  e.currentTarget.style.color = theme.muted
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                <span style={{ fontSize: "1.25rem" }}>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
