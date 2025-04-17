"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { EmptyState } from "@/components/ui/EmptyState"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, BookOpen, Plus, Trash2, X, Save } from "lucide-react"
import { addToast } from "@/utils/toast"
import { useUserData } from "@/context/UserDataContext"
import { MarkdownEditor } from "@/components/ui/MarkdownEditor"

type Subtopic = {
  id: string
  name: string
  topicId: string
  noteId?: string
  status: "not_started" | "in_progress" | "completed"
}

type Subject = {
  id: string
  name: string
}

type Topic = {
  id: string
  name: string
  subjectId: string
  subtopics: Subtopic[]
}

type Note = {
  id: string
  title: string
  content: string
  subtopicId: string
}

export default function SubtopicsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUserData()
  const subjectId = searchParams.get("subjectId")
  const topicId = searchParams.get("topicId")
  const [subject, setSubject] = useState<Subject | null>(null)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [subtopicInput, setSubtopicInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [currentSubtopic, setCurrentSubtopic] = useState<Subtopic | null>(null)
  const [noteContent, setNoteContent] = useState("")
  const [noteTitle, setNoteTitle] = useState("")
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    console.log("SubtopicsPage useEffect - subjectId:", subjectId, "topicId:", topicId)
    if (!subjectId || !topicId) {
      console.log("Redirecting due to missing subjectId or topicId")
      router.push(subjectId ? `/topics?subjectId=${subjectId}` : "/subjects")
      return
    }

    const mockSubjects: Subject[] = [
      { id: "1", name: "CSS Basics" },
      { id: "2", name: "Pakistan Studies" },
    ]

    const mockTopics: Topic[] = [
      {
        id: "t1",
        name: "Flexbox",
        subjectId: "1",
        subtopics: [
          { id: "s1", name: "Flexbox Basics", topicId: "t1", noteId: "n1", status: "completed" },
          { id: "s2", name: "Flexbox Properties", topicId: "t1", noteId: "n2", status: "in_progress" },
        ],
      },
      {
        id: "t2",
        name: "Grid Layout",
        subjectId: "1",
        subtopics: [
          { id: "s3", name: "Grid Basics", topicId: "t2", noteId: "n3", status: "not_started" },
          { id: "s4", name: "Grid Template Areas", topicId: "t2", status: "not_started" },
        ],
      },
      {
        id: "t3",
        name: "History",
        subjectId: "2",
        subtopics: [
          { id: "s5", name: "Independence Movement", topicId: "t3", noteId: "n5", status: "completed" },
          { id: "s6", name: "Post-Independence Era", topicId: "t3", noteId: "n6", status: "completed" },
        ],
      },
    ]

    const mockNotes: Note[] = [
      { id: "n1", title: "Flexbox Basics Notes", content: "# Flexbox Basics\n\nThis is a detailed note with over 50 characters of content to mark it as completed.", subtopicId: "s1" },
      { id: "n2", title: "Flexbox Properties Notes", content: "# Flexbox Properties\n\nShort note", subtopicId: "s2" },
      { id: "n3", title: "Grid Basics Notes", content: "# Grid Basics\n\nStart writing your notes here...", subtopicId: "s3" },
      { id: "n5", title: "Independence Movement Notes", content: "# Independence Movement\n\nDetailed content here to mark as completed.", subtopicId: "s5" },
      { id: "n6", title: "Post-Independence Era Notes", content: "# Post-Independence Era\n\nDetailed content here to mark as completed.", subtopicId: "s6" },
    ]

    const selectedSubject = mockSubjects.find((s) => s.id === subjectId)
    const selectedTopic = mockTopics.find((t) => t.id === topicId && t.subjectId === subjectId)

    console.log("Selected Subject:", selectedSubject, "Selected Topic:", selectedTopic)

    if (selectedSubject && selectedTopic) {
      setSubject(selectedSubject)
      setTopic(selectedTopic)
      setNotes(mockNotes)
      setLoading(false)
    } else {
      console.log("Redirecting to /subjects - Subject or Topic not found")
      router.push("/subjects")
    }
  }, [subjectId, topicId, router])

  const handleAddSubtopics = () => {
    if (!subtopicInput.trim() || !topic) return

    const subtopicNames = subtopicInput
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name)

    const newSubtopics = subtopicNames.map((name) => ({
      id: `subtopic-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      topicId: topic.id,
      status: "not_started" as const,
    }))

    setTopic((prev) => {
      if (!prev) return null
      return { ...prev, subtopics: [...prev.subtopics, ...newSubtopics] }
    })
    setSubtopicInput("")
  }

  const handleShareSubtopic = (subtopic: Subtopic) => {
    const postData = {
      id: `post-${Date.now()}`,
      userId: user?.id || "anonymous",
      userName: user?.name || "Anonymous User",
      type: "subtopic",
      title: subtopic.name,
      preview: `Subtopic under ${topic?.name}: ${subtopic.name}`,
      content: {
        subjectId,
        subjectName: subject?.name,
        topicId,
        topicName: topic?.name,
        name: subtopic.name,
        notes: notes.find((note) => note.id === subtopic.noteId)?.content || "",
      },
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    }

    console.log("Sharing subtopic to community:", postData)
    addToast(`"${subtopic.name}" has been shared to Community Hub!`, "success")
  }

  const handleShareSubtopics = () => {
    if (!topic || !subject) return

    const postData = {
      id: `post-${Date.now()}`,
      userId: user?.id || "anonymous",
      userName: user?.name || "Anonymous User",
      type: "subtopics",
      title: `Subtopics for ${topic.name}`,
      preview: `List of ${topic.subtopics.length} subtopics for ${topic.name}`,
      content: {
        subjectId,
        subjectName: subject.name,
        topicId,
        topicName: topic.name,
        subtopics: topic.subtopics.map((subtopic) => ({
          name: subtopic.name,
          notes: notes.find((note) => note.id === subtopic.noteId)?.content || "",
        })),
      },
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    }

    console.log("Sharing subtopics to community:", postData)
    addToast(`Subtopics for ${topic.name} have been shared to Community Hub!`, "success")
  }

  const handleDeleteSubtopic = (subtopicId: string) => {
    setTopic((prev) => {
      if (!prev) return null
      return { ...prev, subtopics: prev.subtopics.filter((subtopic) => subtopic.id !== subtopicId) }
    })
    addToast("Subtopic deleted successfully", "success")
  }

  const handleOpenNoteEditor = (subtopic: Subtopic) => {
    setCurrentSubtopic(subtopic)

    const existingNote = notes.find((note) => note.id === subtopic.noteId)
    if (existingNote) {
      setNoteTitle(existingNote.title)
      setNoteContent(existingNote.content)
    } else {
      const defaultContent = `# ${subtopic.name}\n\nStart writing your notes here...`
      setNoteTitle(`${subtopic.name} Notes`)
      setNoteContent(defaultContent)
    }

    setIsNoteModalOpen(true)
  }

  const handleSaveNote = async () => {
    if (!currentSubtopic) return

    const note = {
      id: currentSubtopic.noteId || `note-${Date.now()}`,
      title: noteTitle,
      content: noteContent,
      subtopicId: currentSubtopic.id,
    }

    setNotes((prev) => {
      const existingNoteIndex = prev.findIndex((n) => n.id === note.id)
      if (existingNoteIndex !== -1) {
        const updatedNotes = [...prev]
        updatedNotes[existingNoteIndex] = note
        return updatedNotes
      }
      return [...prev, note]
    })

    const trimmedContent = note.content.replace(`# ${currentSubtopic.name}\n\nStart writing your notes here...`, "").trim()
    const newStatus = trimmedContent.length === 0 ? "not_started" : trimmedContent.length < 50 ? "in_progress" : "completed"

    setTopic((prev) => {
      if (!prev) return null
      return {
        ...prev,
        subtopics: prev.subtopics.map((subtopic) =>
          subtopic.id === currentSubtopic.id ? { ...subtopic, noteId: note.id, status: newStatus } : subtopic
        ),
      }
    })

    console.log("Saving note:", note)
    setIsNoteModalOpen(false)
    setCurrentSubtopic(null)
  }

  const getStatusColor = (status: Subtopic["status"]) => {
    switch (status) {
      case "not_started":
        return "bg-gray-500/20 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400"
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-400"
      case "completed":
        return "bg-green-500/20 text-green-500 dark:bg-green-500/20 dark:text-green-400"
      default:
        return "bg-gray-500/20 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400"
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading subtopics..." />
        </div>
      </MainLayout>
    )
  }

  if (!subject || !topic) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading subtopics..." />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <header className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => router.push(`/topics?subjectId=${subjectId}`)}
            className="p-2 text-primary bg-primary/20 rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900">Define Subtopics for {topic.name}</h1>
            <p className="text-secondary-foreground dark:text-gray-300 text-gray-600">Add subtopics for your topic</p>
          </div>
        </div>
        <Button onClick={handleShareSubtopics} disabled={topic.subtopics.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          Share Subtopics
        </Button>
      </header>

      <div className="mb-8 flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={subtopicInput}
            onChange={(e) => setSubtopicInput(e.target.value)}
            placeholder="Enter subtopics (comma-separated)"
            className="w-full px-4 py-2 bg-[#2D2D2D] border border-white/10 rounded-md text-white placeholder-[#D1D5DB] focus:ring-2 focus:ring-primary focus:border-primary backdrop-blur-md dark:bg-[#2D2D2D] dark:border-white/10 dark:text-white dark:placeholder-[#D1D5DB] bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400 dark:focus:ring-primary dark:focus:border-primary focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <motion.button
          onClick={handleAddSubtopics}
          className="px-4 py-2 bg-primary text-white rounded-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Subtopics
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topic.subtopics.length === 0 ? (
          <div className="col-span-full">
            <GlassCard>
              <EmptyState
                icon={BookOpen}
                title="No subtopics defined yet"
                description="Add your first subtopic to continue building your syllabus"
                action={{
                  label: "Add Sample Subtopic",
                  onClick: () => setSubtopicInput("Fundamentals"),
                }}
              />
            </GlassCard>
          </div>
        ) : (
          topic.subtopics.map((subtopic) => (
            <GlassCard
              key={subtopic.id}
              className="w-[340px] h-[215px] p-4 cursor-pointer hover:border-primary/30 transition-colors dark:bg-white/10 bg-black/10 dark:border-white/20 border-black/20 flex flex-col justify-between"
            >
              <div className="flex-1" onClick={() => handleOpenNoteEditor(subtopic)}>
                <h2 className="text-lg font-bold dark:text-white text-gray-900">{subtopic.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`px-2 py-1 text-xs rounded ${getStatusColor(subtopic.status)}`}>
                    {subtopic.status.replace("_", " ").charAt(0).toUpperCase() + subtopic.status.replace("_", " ").slice(1)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShareSubtopic(subtopic)
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
                    handleDeleteSubtopic(subtopic.id)
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

      <AnimatePresence>
        {isNoteModalOpen && currentSubtopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setIsNoteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[rgba(255,255,255,0.1)] backdrop-blur-md border-[rgba(255,255,255,0.2)] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[rgba(255,255,255,0.2)] flex justify-between items-center">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="bg-transparent text-xl font-bold text-white border-none focus:outline-none focus:ring-0 w-full"
                  placeholder="Note Title"
                />
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={handleSaveNote}
                    className="px-4 py-2 bg-[#3B82F6] text-white rounded-md flex items-center shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </motion.button>
                  <motion.button
                    onClick={() => setIsNoteModalOpen(false)}
                    className="p-2 text-[#D1D5DB]"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-auto min-h-[60vh] bg-[#1E1E1E]">
                <MarkdownEditor
                  initialValue={noteContent}
                  onChange={setNoteContent}
                  className="h-full"
                  autoFocus={true}
                  placeholder={`Start writing your notes about ${currentSubtopic.name}...`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  )
}