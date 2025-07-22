"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Moon,
  Brain,
  Dumbbell,
  TrendingUp,
  Calendar,
  Target,
  Award,
  MessageCircle,
  ArrowLeft,
  Shield,
} from "lucide-react"

interface MetricData {
  current: number
  goal: number
  streak: number
  weeklyAverage: number
  trend: "up" | "down" | "stable"
}

export default function DashboardPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const router = useRouter()

  // Sample health metrics data
  const [metrics] = useState({
    sleep: {
      current: 7.5,
      goal: 8,
      streak: 5,
      weeklyAverage: 7.2,
      trend: "up" as const,
    },
    meditate: {
      current: 15,
      goal: 20,
      streak: 12,
      weeklyAverage: 18,
      trend: "stable" as const,
    },
    workout: {
      current: 4,
      goal: 5,
      streak: 3,
      weeklyAverage: 3.8,
      trend: "up" as const,
    },
  })

  useEffect(() => {
    const storedPhone = localStorage.getItem("aura-phone")
    if (!storedPhone) {
      router.push("/")
      return
    }
    setPhoneNumber(storedPhone)
  }, [router])

  const MetricCard = ({
    title,
    icon: Icon,
    data,
    unit,
    color,
  }: {
    title: string
    icon: any
    data: MetricData
    unit: string
    color: string
  }) => {
    const progress = (data.current / data.goal) * 100

    return (
      <Card className="relative overflow-hidden bg-gray-900/95 border-gray-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg text-white">{title}</CardTitle>
            </div>
            <Badge
              variant={data.trend === "up" ? "default" : "secondary"}
              className="text-xs bg-gray-800 text-gray-300"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              {data.trend}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium text-white">
                {data.current}
                {unit} / {data.goal}
                {unit}
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-800" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-400">
                <Target className="w-3 h-3" />
                <span>Streak</span>
              </div>
              <p className="font-semibold text-white">{data.streak} days</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>Weekly Avg</span>
              </div>
              <p className="font-semibold text-white">
                {data.weeklyAverage}
                {unit}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <Image src="/images/aura-logo.png" alt="Aura Logo" width={40} height={40} className="rounded-lg" />
                <div>
                  <h1 className="text-xl font-bold text-white">Aura Dashboard</h1>
                  <p className="text-sm text-gray-400">{phoneNumber}</p>
                </div>
              </div>
            </div>
            <Button className="bg-teal-500 hover:bg-teal-600 text-black font-semibold">
              <MessageCircle className="w-4 h-4 mr-2" />
              Open WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
          <p className="text-gray-400">Here's your wellbeing progress for today</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-teal-500 to-cyan-500 text-black border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black/70 text-sm font-medium">Total Score</p>
                  <p className="text-3xl font-bold">85%</p>
                </div>
                <Award className="w-8 h-8 text-black/70" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/95 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Streak</p>
                  <p className="text-3xl font-bold text-teal-400">12</p>
                </div>
                <Target className="w-8 h-8 text-teal-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/95 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">This Week</p>
                  <p className="text-3xl font-bold text-teal-400">4/5</p>
                </div>
                <Calendar className="w-8 h-8 text-teal-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Metrics */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Health Tracking</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MetricCard title="Sleep" icon={Moon} data={metrics.sleep} unit="h" color="bg-teal-500" />

            <MetricCard title="Meditate" icon={Brain} data={metrics.meditate} unit="min" color="bg-teal-500" />

            <MetricCard title="Workout" icon={Dumbbell} data={metrics.workout} unit=" sessions" color="bg-cyan-500" />
          </div>
        </div>

        {/* Target Audience Section */}
        <div className="mt-8 bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">Your Wellness Journey</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-teal-500/20 p-2 rounded-full mt-1">
                <Target className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Consistency is key</h4>
                <p className="text-sm text-gray-400">Aura helps you maintain habits even when motivation fades</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-teal-500/20 p-2 rounded-full mt-1">
                <Shield className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Health risk management</h4>
                <p className="text-sm text-gray-400">Personalized guidance for your specific health concerns</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-teal-500/20 p-2 rounded-full mt-1">
                <MessageCircle className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Simplified wellness</h4>
                <p className="text-sm text-gray-400">Clear direction without overwhelming data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-16 flex-col gap-2 bg-transparent border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 hover:border-gray-600"
            >
              <Moon className="w-5 h-5" />
              Log Sleep
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col gap-2 bg-transparent border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 hover:border-gray-600"
            >
              <Brain className="w-5 h-5" />
              Start Meditation
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col gap-2 bg-transparent border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 hover:border-gray-600"
            >
              <Dumbbell className="w-5 h-5" />
              Log Workout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
