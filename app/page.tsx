"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Heart, Shield } from "lucide-react"

export default function HomePage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Store phone number in localStorage for the dashboard
    localStorage.setItem("aura-phone", phoneNumber)

    // Navigate to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image src="/images/aura-logo.png" alt="Aura Logo" width={120} height={120} className="rounded-xl" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Aura
          </h1>
          <p className="text-gray-200 text-lg">Your Personal Wellbeing Coach</p>
        </div>

        {/* Main Card */}
        <Card className="border border-gray-800 shadow-xl bg-gray-900/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-semibold text-white">Subscribe to a better you</CardTitle>
            <CardDescription className="text-gray-300">
              Get personalized wellbeing guidance through WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <MessageCircle className="w-5 h-5 text-teal-400" />
                <span>24/7 WhatsApp wellness coach</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Heart className="w-5 h-5 text-teal-400" />
                <span>Personalized health tracking</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Shield className="w-5 h-5 text-teal-400" />
                <span>Support for consistent health habits</span>
              </div>
            </div>

            {/* Phone Number Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-300">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-12 text-lg bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-teal-400"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-black font-semibold"
                disabled={isLoading || !phoneNumber}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </div>
                ) : (
                  "Start Your Journey"
                )}
              </Button>
            </form>

            <p className="text-xs text-gray-500 text-center">
              By subscribing, you agree to receive WhatsApp messages from Aura
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
