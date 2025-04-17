"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { EmptyState } from "@/components/ui/EmptyState"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Plus, Trash2 } from "lucide-react"
import { addToast } from "@/utils/toast"
import { useUserData } from "@/context/UserDataContext"

type Topic = {
  id: string
  name: string
}

type Subject = {
  id: string
  name: string
}

export default function TopicsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUserData()
  const subjectId = searchParams.get("subjectId")
  const [topics, setTopics] = useState<Topic[]>([])
  const [topicInput, setTopicInput] = useState("")
  const [subject, setSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!subjectId) {
      router.push("/subjects")
      return
    }

    const mockSubjects: Subject[] = [
      { id: "1", name: "CSS Basics" },
      { id: "2", name: "Pakistan Studies" },
    ]

    const mockTopics: Topic[] = [
      { id: "t1", name: "Flexbox" },
      { id: "t2", name: "Grid Layout" },
    ]

    const selectedSubject = mockSubjects.find((s) => s.id === subjectId)
    if (!selectedSubject) {
      router.push("/subjects")
      return
    }

    setSubject(selectedSubject)
    setTopics(mockTopics)
    setLoading(false)
  }, [subjectId, router])

  const handleAddTopics = () => {
    if (!topicInput.trim()) return

    const topicNames = topicInput
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name)

    const newTopics = topicNames.map((name) => ({
      id: `topic-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
    }))

    setTopics((prev) => [...prev, ...newTopics])
    setTopicInput("")
  }

  const handleSelectTopic = (topicId: string) => {
    router.push(`/subtopics?subjectId=${subjectId}&topicId=${topicId}`)
  }

  const handleShareTopic = (topic: Topic) => {
    const postData = {
      id: `post-${Date.now()}`,
      userId: user?.id || "anonymous",
      userName: user?.name || "Anonymous User",
      type: "topic",
      title: topic.name,
      preview: `Topic under ${subject?.name}: ${topic.name}`,
      content: {
        subjectId,
        subjectName: subject?.name,
        name: topic.name,
        subtopics: [],
      },
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    }

    console.log("Sharing topic to community:", postData)
    addToast(`"${topic.name}" has been shared to Community Hub!`, "success")
  }

  const handleShareTopics = () => {
    const postData = {
      id: `post-${Date.now()}`,
      userId: user?.id || "anonymous",
      userName: user?.name || "Anonymous User",
      type: "topics",
      title: `Topics for ${subject?.name}`,
      preview: `List of ${topics.length} topics for ${subject?.name}`,
      content: {
        subjectId,
        subjectName: subject?.name,
        topics: topics.map((topic) => ({
          name: topic.name,
          subtopics: [],
        })),
      },
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    }

    console.log("Sharing topics to community:", postData)
    addToast(`Topics for ${subject?.name} have been shared to Community Hub!`, "success")
  }

  const handleDeleteTopic = (topicId: string) => {
    setTopics((prev) => prev.filter((topic) => topic.id !== topicId))
    addToast("Topic deleted successfully", "success")
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading topics..." />
        </div>
      </MainLayout>
    )
  }

  if (!subject) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading topics..." />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <header className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => router.push("/subjects")}
            className="p-2 text-primary bg-primary/20 rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900">Define Topics for {subject.name}</h1>
            <p className="text-secondary-foreground dark:text-gray-300 text-gray-600">Add topics for your subject</p>
          </div>
        </div>
        <Button onClick={handleShareTopics} disabled={topics.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          Share Topics
        </Button>
      </header>

      <div className="mb-8 flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Enter topics (comma-separated)"
            className="w-full px-4 py-2 bg-[#2D2D2D] border border-white/10 rounded-md text-white placeholder-[#D1D5DB] focus:ring-2 focus:ring-primary focus:border-primary backdrop-blur-md dark:bg-[#2D2D2D] dark:border-white/10 dark:text-white dark:placeholder-[#D1D5DB] bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400 dark:focus:ring-primary dark:focus:border-primary focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <motion.button
          onClick={handleAddTopics}
          className="px-4 py-2 bg-primary text-white rounded-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Topics
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.length === 0 ? (
          <div className="col-span-full">
            <GlassCard>
              <EmptyState
                icon={BookOpen}
                title="No topics defined yet"
                description="Add your first topic to continue building your syllabus"
                action={{
                  label: "Add Sample Topic",
                  onClick: () => setTopicInput("Introduction"),
                }}
              />
            </GlassCard>
          </div>
        ) : (
          topics.map((topic) => (
            <GlassCard
              key={topic.id}
              className="w-[340px] h-[215px] p-4 cursor-pointer hover:border-primary/30 transition-colors dark:bg-white/10 bg-black/10 dark:border-white/20 border-black/20 flex flex-col justify-between"
            >
              <div
                className="flex-1 flex items-center"
                onClick={() => handleSelectTopic(topic.id)}
              >
                <h2 className="text-lg font-bold dark:text-white text-gray-900">{topic.name}</h2>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShareTopic(topic)
                  }}
                  className="p-2 text-primary bg-primary/20 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteTopic(topic.id)
                  }}
                  className="p-2 text-red-500 bg-red-500/20 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </MainLayout>
  )
}