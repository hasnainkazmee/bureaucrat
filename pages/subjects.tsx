"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { EmptyState } from "@/components/ui/EmptyState"
import { motion } from "framer-motion"
import { BookOpen, Plus, Trash2 } from "lucide-react"
import { addToast } from "@/utils/toast"
import { useUserData } from "@/context/UserDataContext"

type Subject = {
  id: string
  name: string
}

export default function SubjectsPage() {
  const router = useRouter()
  const { user } = useUserData()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectInput, setSubjectInput] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock fetch subjects
    const mockSubjects: Subject[] = [
      { id: "1", name: "CSS Basics" },
      { id: "2", name: "Pakistan Studies" },
    ]
    setSubjects(mockSubjects)
    setLoading(false)
  }, [])

  const handleAddSubjects = () => {
    if (!subjectInput.trim()) return

    const subjectNames = subjectInput
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name)

    const newSubjects = subjectNames.map((name) => ({
      id: `subject-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
    }))

    setSubjects((prev) => [...prev, ...newSubjects])
    setSubjectInput("")
  }

  const handleSelectSubject = (subjectId: string) => {
    router.push(`/topics?subjectId=${subjectId}`)
  }

  const handleShareSubject = (subject: Subject) => {
    const postData = {
      id: `post-${Date.now()}`,
      userId: user?.id || "anonymous",
      userName: user?.name || "Anonymous User",
      type: "subject",
      title: subject.name,
      preview: `Complete syllabus for ${subject.name}`,
      content: {
        name: subject.name,
        // In a real app, fetch topics and subtopics for this subject
        topics: [], // Placeholder; add actual topics if needed
      },
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    }

    console.log("Sharing subject to community:", postData)
    addToast(`"${subject.name}" has been shared to Community Hub!`, "success")
  }

  const handleShareSyllabus = () => {
    const postData = {
      id: `post-${Date.now()}`,
      userId: user?.id || "anonymous",
      userName: user?.name || "Anonymous User",
      type: "syllabus",
      title: "Complete CSS Exam Syllabus",
      preview: `Full syllabus with ${subjects.length} subjects`,
      content: {
        subjects: subjects.map((subject) => ({
          name: subject.name,
          topics: [], // Placeholder; add actual topics if needed
        })),
      },
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    }

    console.log("Sharing entire syllabus to community:", postData)
    addToast(`Complete syllabus with ${subjects.length} subjects has been shared to Community Hub!`, "success")
  }

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((subject) => subject.id !== subjectId))
    addToast("Subject deleted successfully", "success")
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading subjects..." />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Define Subjects</h1>
          <p className="text-secondary-foreground">Add subjects for your CSS exam syllabus</p>
        </div>
        <Button onClick={handleShareSyllabus} disabled={subjects.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          Share Syllabus
        </Button>
      </header>

      <div className="mb-8 flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            placeholder="Enter subjects (comma-separated)"
            className="w-full px-4 py-2 bg-[#2D2D2D] border border-white/10 rounded-md text-white placeholder-[#D1D5DB] focus:ring-2 focus:ring-primary focus:border-primary backdrop-blur-md"
          />
        </div>
        <motion.button
          onClick={handleAddSubjects}
          className="px-4 py-2 bg-primary text-white rounded-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Subjects
        </motion.button>
      </div>

      <div className="space-y-6">
        {subjects.length === 0 ? (
          <GlassCard>
            <EmptyState
              icon={BookOpen}
              title="No subjects defined yet"
              description="Add your first subject to start building your syllabus"
              action={{
                label: "Add Sample Subject",
                onClick: () => setSubjectInput("CSS Fundamentals"),
              }}
            />
          </GlassCard>
        ) : (
          subjects.map((subject) => (
            <GlassCard
              key={subject.id}
              className="cursor-pointer hover:border-primary/30 transition-colors"
            >
              <div className="flex justify-between items-center p-4">
                <div
                  className="flex-1"
                  onClick={() => handleSelectSubject(subject.id)}
                >
                  <h2 className="text-xl font-bold">{subject.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => handleShareSubject(subject)}
                    className="p-2 text-primary bg-primary/20 rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="p-2 text-red-500 bg-red-500/20 rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </MainLayout>
  )
}