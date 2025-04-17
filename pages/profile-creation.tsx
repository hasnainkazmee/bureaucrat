"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { User, Calendar, BookOpen } from "lucide-react"

export default function ProfileCreationPage() {
  const [name, setName] = useState("")
  const [examDate, setExamDate] = useState("")
  const [studyGoals, setStudyGoals] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Save to Firebase Firestore
    console.log("Profile data:", { name, examDate, studyGoals })

    // Navigate to dashboard
    router.push("/dashboard")
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
              <div className="bg-primary h-2 rounded-full w-full"></div>
            </div>
            <h1 className="text-2xl font-bold">Complete your profile</h1>
            <p className="text-secondary-foreground mt-2">Just a few more details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-white/10 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="exam-date" className="block text-sm font-medium mb-1">
                Exam Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
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
                Study Goals
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-4 w-5 h-5 text-secondary-foreground" />
                <textarea
                  id="study-goals"
                  value={studyGoals}
                  onChange={(e) => setStudyGoals(e.target.value)}
                  required
                  rows={4}
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-white/10 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g. I want to master flexbox and grid layouts"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Finish Setup
            </Button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  )
}
