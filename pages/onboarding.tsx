"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { CalendarIcon } from "lucide-react"

export default function OnboardingPage() {
  const [examDate, setExamDate] = useState("")
  const [studyGoals, setStudyGoals] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Save to Firebase Firestore
    console.log("Form submitted:", { examDate, studyGoals })

    // Navigate to next step
    router.push("/profile-creation")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard>
          <div className="mb-6">
            <div className="w-full bg-muted h-2 rounded-full mb-6">
              <div className="bg-primary h-2 rounded-full w-1/2"></div>
            </div>
            <h1 className="text-2xl font-bold">Set your study timeline</h1>
            <p className="text-secondary-foreground mt-2">Help us personalize your study plan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="exam-date" className="block text-sm font-medium mb-1">
                When is your exam?
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                <input
                  id="exam-date"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-white/10 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="study-goals" className="block text-sm font-medium mb-1">
                What are your study goals?
              </label>
              <textarea
                id="study-goals"
                value={studyGoals}
                onChange={(e) => setStudyGoals(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 bg-muted border border-white/10 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g. I want to master flexbox and grid layouts"
              />
            </div>

            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  )
}
