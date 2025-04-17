"use client"

import { MainLayout } from "@/components/layout/MainLayout"
import { GlassCard } from "@/components/ui/GlassCard"
import { ProgressCircle } from "@/components/ui/ProgressCircle"
import { useUserData } from "@/context/UserDataContext"
import { motion } from "framer-motion"

export default function ProgressPage() {
  const { userData, loading } = useUserData()

  if (loading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary-foreground">Loading progress data...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <p className="text-secondary-foreground">Track your CSS learning journey</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard className="md:col-span-2">
          <div className="flex flex-col items-center justify-center py-8">
            <ProgressCircle value={userData.progress.overall} size="lg" />
            <h2 className="text-2xl font-bold mt-6">Overall Progress</h2>
            <p className="text-secondary-foreground">
              You've completed {userData.progress.overall}% of your CSS curriculum
            </p>
          </div>
        </GlassCard>

        {userData.progress.topics.map((topic, index) => (
          <GlassCard key={index}>
            <h3 className="text-xl font-bold mb-4">{topic.name}</h3>
            <div className="flex items-center gap-4">
              <ProgressCircle value={topic.progress} size="md" />
              <div>
                <div className="text-lg font-bold">{topic.progress}%</div>
                <p className="text-sm text-secondary-foreground">Completed</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full h-2 bg-muted rounded-full">
                <motion.div
                  className="h-2 bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </MainLayout>
  )
}
