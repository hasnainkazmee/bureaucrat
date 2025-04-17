"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { useUserData } from "@/context/UserDataContext"
import { ChevronDown, ChevronUp, Plus, Trash2, X, Save, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { MarkdownEditor } from "@/components/ui/MarkdownEditor"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { EmptyState } from "@/components/ui/EmptyState"
import { addToast } from "@/utils/toast"

// Define types for our syllabus structure
type Subtopic = {
  id: string
  name: string
  noteId?: string
}

type Topic = {
  id: string
  name: string
  subtopics: Subtopic[]
}

type Subject = {
  id: string
  name: string
  topics: Topic[]
}

export default function SyllabusPage() {
  const { userData, loading, toggleTopicCompletion, saveNote, user } = useUserData()

  // State for syllabus structure
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({})

  // State for input fields
  const [subjectInput, setSubjectInput] = useState("")
  const [topicInput, setTopicInput] = useState("")
  const [subtopicInput, setSubtopicInput] = useState("")

  // Selected items
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  // Note editor modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [currentSubtopic, setCurrentSubtopic] = useState<Subtopic | null>(null)
  const [noteContent, setNoteContent] = useState("")
  const [noteTitle, setNoteTitle] = useState("")

  // Initialize with mock data
  useEffect(() => {
    // TODO: Fetch from Firestore under subjects collection
    const mockSubjects: Subject[] = [
      {
        id: "1",
        name: "CSS Basics",
        topics: [
          {
            id: "t1",
            name: "Flexbox",
            subtopics: [
              { id: "s1", name: "Flexbox Basics", noteId: "n1" },
              { id: "s2", name: "Flexbox Properties", noteId: "n2" },
            ],
          },
          {
            id: "t2",
            name: "Grid Layout",
            subtopics: [
              { id: "s3", name: "Grid Basics", noteId: "n3" },
              { id: "s4", name: "Grid Template Areas", noteId: "n4" },
            ],
          },
        ],
      },
      {
        id: "2",
        name: "Pakistan Studies",
        topics: [
          {
            id: "t3",
            name: "History",
            subtopics: [
              { id: "s5", name: "Independence Movement", noteId: "n5" },
              { id: "s6", name: "Post-Independence Era", noteId: "n6" },
            ],
          },
        ],
      },
    ]

    setSubjects(mockSubjects)

    // Set initial expanded states
    const initialExpandedSections: Record<string, boolean> = {}
    const initialExpandedTopics: Record<string, boolean> = {}

    mockSubjects.forEach((subject) => {
      initialExpandedSections[subject.id] = false
      subject.topics.forEach((topic) => {
        initialExpandedTopics[topic.id] = false
      })
    })

    setExpandedSections(initialExpandedSections)
    setExpandedTopics(initialExpandedTopics)
  }, [])

  // Toggle a subject's expanded state
  const toggleSection = (subjectId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }))
  }

  // Toggle a topic's expanded state
  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }))
  }

  // Handle adding a new subject
  const handleAddSubject = () => {
    if (!subjectInput.trim()) return

    const subjectNames = subjectInput
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name)

    const newSubjects = subjectNames.map((name) => ({
      id: `subject-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      topics: [],
    }))

    setSubjects((prev) => [...prev, ...newSubjects])
    setSubjectInput("")

    // Auto-select the first new subject if no subject is selected
    if (!selectedSubject && newSubjects.length > 0) {
      setSelectedSubject(newSubjects[0])
    }

    // Update expanded sections
    const updatedExpandedSections = { ...expandedSections }
    newSubjects.forEach((subject) => {
      updatedExpandedSections[subject.id] = true
    })
    setExpandedSections(updatedExpandedSections)

    // TODO: Save to Firestore under subjects collection
  }

  // Handle adding a new topic to the selected subject
  const handleAddTopic = () => {
    if (!topicInput.trim() || !selectedSubject) return

    const topicNames = topicInput
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name)

    const newTopics = topicNames.map((name) => ({
      id: `topic-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      subtopics: [],
    }))

    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === selectedSubject.id ? { ...subject, topics: [...subject.topics, ...newTopics] } : subject,
      ),
    )

    setTopicInput("")

    // Auto-select the first new topic if no topic is selected
    if (!selectedTopic && newTopics.length > 0) {
      setSelectedTopic(newTopics[0])
    }

    // Update expanded topics
    const updatedExpandedTopics = { ...expandedTopics }
    newTopics.forEach((topic) => {
      updatedExpandedTopics[topic.id] = true
    })
    setExpandedTopics(updatedExpandedTopics)

    // Update selected subject with the new topics
    setSelectedSubject((prev) => {
      if (!prev) return null
      return {
        ...prev,
        topics: [...prev.topics, ...newTopics],
      }
    })

    // TODO: Save to Firestore under subjects collection
  }

  // Handle adding a new subtopic to the selected topic
  const handleAddSubtopic = () => {
    if (!subtopicInput.trim() || !selectedSubject || !selectedTopic) return

    const subtopicNames = subtopicInput
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name)

    const newSubtopics = subtopicNames.map((name) => ({
      id: `subtopic-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
    }))

    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === selectedSubject.id
          ? {
              ...subject,
              topics: subject.topics.map((topic) =>
                topic.id === selectedTopic.id ? { ...topic, subtopics: [...topic.subtopics, ...newSubtopics] } : topic,
              ),
            }
          : subject,
      ),
    )

    setSubtopicInput("")

    // Update selected topic with the new subtopics
    setSelectedTopic((prev) => {
      if (!prev) return null
      return {
        ...prev,
        subtopics: [...prev.subtopics, ...newSubtopics],
      }
    })

    // TODO: Save to Firestore under subjects collection
  }

  // Handle selecting a subject
  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject)
    setSelectedTopic(null)
  }

  // Handle selecting a topic
  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic)
  }

  // Handle opening the note editor for a subtopic
  const handleOpenNoteEditor = (subtopic: Subtopic) => {
    setCurrentSubtopic(subtopic)

    // TODO: Fetch from Firestore under notes collection
    const mockNote = {
      id: subtopic.noteId || `note-${Date.now()}`,
      title: `${subtopic.name} Notes`,
      content: subtopic.noteId
        ? `# ${subtopic.name}\n\nThis is a sample note for ${subtopic.name}. Edit me!`
        : `# ${subtopic.name}\n\nStart writing your notes here...`,
      subtopicId: subtopic.id,
    }

    setNoteTitle(mockNote.title)
    setNoteContent(mockNote.content)
    setIsNoteModalOpen(true)
  }

  // Handle saving a note
  const handleSaveNote = async () => {
    if (!currentSubtopic) return

    // Create note object
    const note = {
      id: currentSubtopic.noteId || `note-${Date.now()}`,
      title: noteTitle,
      content: noteContent,
      updatedAt: new Date().toISOString(),
      subtopicId: currentSubtopic.id,
    }

    // Save the note
    // TODO: Save to Firestore under notes collection
    console.log("Saving note:", note)

    // Update the subtopic with the note ID
    if (!currentSubtopic.noteId) {
      setSubjects((prev) =>
        prev.map((subject) => ({
          ...subject,
          topics: subject.topics.map((topic) => ({
            ...topic,
            subtopics: topic.subtopics.map((subtopic) =>
              subtopic.id === currentSubtopic.id ? { ...subtopic, noteId: note.id } : subtopic,
            ),
          })),
        })),
      )
    }

    // Close the modal
    setIsNoteModalOpen(false)
    setCurrentSubtopic(null)
  }

  // Handle deleting a subject
  const handleDeleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((subject) => subject.id !== subjectId))

    // Reset selected subject if it was deleted
    if (selectedSubject?.id === subjectId) {
      setSelectedSubject(null)
      setSelectedTopic(null)
    }

    // TODO: Delete from Firestore under subjects collection
  }

  // Handle deleting a topic
  const handleDeleteTopic = (subjectId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === subjectId
          ? { ...subject, topics: subject.topics.filter((topic) => topic.id !== topicId) }
          : subject,
      ),
    )

    // Reset selected topic if it was deleted
    if (selectedTopic?.id === topicId) {
      setSelectedTopic(null)
    }

    // TODO: Delete from Firestore under Firestore under subjects collection
  }

  // Handle deleting a subtopic
  const handleDeleteSubtopic = (subjectId: string, topicId: string, subtopicId: string) => {
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.map((topic) =>
                topic.id === topicId
                  ? { ...topic, subtopics: topic.subtopics.filter((subtopic) => subtopic.id !== subtopicId) }
                  : topic,
              ),
            }
          : subject,
      ),
    )

    // TODO: Delete from Firestore under subjects collection
  }

  // Share subject to community
  const handleShareSubject = (subject: Subject) => {
    // Prepare the data for sharing
    const postData = {
      id: `post-${Date.now()}`,
      userId: user?.id || "anonymous",
      userName: user?.name || "Anonymous User",
      type: "subject",
      title: subject.name,
      preview: `Complete syllabus for ${subject.name}`,
      content: {
        name: subject.name,
        topics: subject.topics.map((topic) => ({
          name: topic.name,
          subtopics: topic.subtopics.map((subtopic) => subtopic.name),
        })),
      },
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    }

    // TODO: Save to Firestore under communityPosts collection
    console.log("Sharing subject to community:", postData)

    // Show toast notification
    addToast(`"${subject.name}" has been shared to Community Hub!`, "success")
  }

  // Share entire syllabus to community
  const handleShareSyllabus = () => {
    // Prepare the data for sharing
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
          topics: subject.topics.map((topic) => topic.name),
        })),
      },
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    }

    // TODO: Save to Firestore under communityPosts collection
    console.log("Sharing entire syllabus to community:", postData)

    // Show toast notification
    addToast(`Complete syllabus with ${subjects.length} subjects has been shared to Community Hub!`, "success")
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading syllabus..." />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Syllabus</h1>
          <p className="text-secondary-foreground">Define and track your CSS exam syllabus</p>
        </div>
        <Button onClick={handleShareSyllabus}>
          <Plus className="w-4 h-4 mr-2" />
          Share Syllabus
        </Button>
      </header>

      {/* Input Bars */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
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
            onClick={handleAddSubject}
            className="px-4 py-2 bg-primary text-white rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Subject
          </motion.button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder={
                selectedSubject
                  ? `Enter topics for ${selectedSubject.name} (comma-separated)`
                  : "Select a subject first"
              }
              className="w-full px-4 py-2 bg-[#2D2D2D] border border-white/10 rounded-md text-white placeholder-[#D1D5DB] focus:ring-2 focus:ring-primary focus:border-primary backdrop-blur-md"
              disabled={!selectedSubject}
            />
          </div>
          <motion.button
            onClick={handleAddTopic}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: selectedSubject ? 1.05 : 1 }}
            whileTap={{ scale: selectedSubject ? 0.95 : 1 }}
            disabled={!selectedSubject}
          >
            Add Topic
          </motion.button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={subtopicInput}
              onChange={(e) => setSubtopicInput(e.target.value)}
              placeholder={
                selectedTopic ? `Enter subtopics for ${selectedTopic.name} (comma-separated)` : "Select a topic first"
              }
              className="w-full px-4 py-2 bg-[#2D2D2D] border border-white/10 rounded-md text-white placeholder-[#D1D5DB] focus:ring-2 focus:ring-primary focus:border-primary backdrop-blur-md"
              disabled={!selectedTopic}
            />
          </div>
          <motion.button
            onClick={handleAddSubtopic}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: selectedTopic ? 1.05 : 1 }}
            whileTap={{ scale: selectedTopic ? 0.95 : 1 }}
            disabled={!selectedTopic}
          >
            Add Subtopic
          </motion.button>
        </div>
      </div>

      {/* Nested Card Structure */}
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
              className={`transition-all duration-300 ${selectedSubject?.id === subject.id ? "border-primary border-2" : ""}`}
            >
              <div className="flex justify-between items-center cursor-pointer">
                <div
                  className="flex-1 flex items-center"
                  onClick={() => {
                    toggleSection(subject.id)
                    handleSelectSubject(subject)
                  }}
                >
                  <Button variant="ghost" size="sm" className="mr-2">
                    {expandedSections[subject.id] ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
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

              <AnimatePresence>
                {expandedSections[subject.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 mt-4 border-t border-white/10 space-y-4">
                      {subject.topics.length === 0 ? (
                        <div className="py-2 text-center text-secondary-foreground">
                          No topics defined yet. Add topics above.
                        </div>
                      ) : (
                        subject.topics.map((topic) => (
                          <motion.div
                            key={topic.id}
                            className={`p-3 rounded-md bg-[#2D2D2D]/50 backdrop-blur-md border border-white/10 ${
                              selectedTopic?.id === topic.id ? "border-primary" : ""
                            }`}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex justify-between items-center">
                              <div
                                className="flex-1 flex items-center cursor-pointer"
                                onClick={() => {
                                  toggleTopic(topic.id)
                                  handleSelectTopic(topic)
                                }}
                              >
                                <Button variant="ghost" size="sm" className="mr-2 h-7 w-7 p-0">
                                  {expandedTopics[topic.id] ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </Button>
                                <h3 className="font-medium">{topic.name}</h3>
                              </div>
                              <motion.button
                                onClick={() => handleDeleteTopic(subject.id, topic.id)}
                                className="p-1 text-red-500"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>

                            <AnimatePresence>
                              {expandedTopics[topic.id] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pl-8 pt-2 mt-2 space-y-2">
                                    {topic.subtopics.length === 0 ? (
                                      <div className="py-1 text-sm text-secondary-foreground">
                                        No subtopics defined yet. Add subtopics above.
                                      </div>
                                    ) : (
                                      topic.subtopics.map((subtopic) => (
                                        <motion.div
                                          key={subtopic.id}
                                          className="flex justify-between items-center p-2 bg-[#1E1E1E]/70 rounded-md cursor-pointer group border border-transparent hover:border-primary/50"
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          onClick={() => handleOpenNoteEditor(subtopic)}
                                        >
                                          <div className="flex items-center">
                                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                                            <span className="text-sm">{subtopic.name}</span>
                                          </div>
                                          <div className="flex items-center">
                                            {subtopic.noteId && (
                                              <div className="px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded mr-2">
                                                Note
                                              </div>
                                            )}
                                            <motion.button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteSubtopic(subject.id, topic.id, subtopic.id)
                                              }}
                                              className="p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </motion.button>
                                          </div>
                                        </motion.div>
                                      ))
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))
        )}
      </div>

      {/* Note Editor Modal */}
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
              className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="bg-transparent text-xl font-bold border-none focus:outline-none focus:ring-0 w-full"
                  placeholder="Note Title"
                />
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={handleSaveNote}
                    className="px-4 py-2 bg-primary text-white rounded-md flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </motion.button>
                  <motion.button
                    onClick={() => setIsNoteModalOpen(false)}
                    className="p-2 text-secondary-foreground"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-auto min-h-[60vh]">
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
