"use client"

import { useUserData } from "@/context/UserDataContext"
import { MainLayout } from "@/components/layout/MainLayout"
import { GlassCard } from "@/components/ui/GlassCard"
import { ProgressCircle } from "@/components/ui/ProgressCircle"
import { Button } from "@/components/ui/Button"
import { CheckCircle, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { userData, loading } = useUserData()

  if (loading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary-foreground">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-secondary-foreground">Your study overview</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Tasks Card */}
        <GlassCard>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Upcoming Tasks</h2>
            <Link href="/subjects">
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {userData.tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                <div className="flex-shrink-0">
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{task.title}</p>
                  <p className="text-xs text-secondary-foreground">Due: {task.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Progress Card */}
        <GlassCard>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Your Progress</h2>
            <Link href="/progress">
              <Button variant="ghost" size="sm" className="text-primary">
                Details
              </Button>
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <ProgressCircle value={userData.progress.overall} size="lg" />
            <p className="mt-4 text-center text-secondary-foreground">Overall completion</p>
          </div>
        </GlassCard>

        {/* Recent Notes Card */}
        <GlassCard className="md:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Recent Notes</h2>
            <Link href="/notes">
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {userData.notes.slice(0, 3).map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`}>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{note.title}</p>
                    <p className="text-xs text-secondary-foreground">
                      Updated: {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-secondary-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  )
}