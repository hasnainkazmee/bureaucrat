"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockNotes, mockSyllabus, mockTasks, mockProgress } from "@/utils/mockData"
import { useAuth } from "./AuthContext"

type UserData = {
  notes: any[]
  syllabus: any[]
  tasks: any[]
  progress: any
}

type UserDataContextType = {
  userData: UserData
  loading: boolean
  refetch: () => Promise<void>
  getNoteById: (id: string) => any
  saveNote: (note: any) => Promise<void>
  toggleTopicCompletion: (topicId: string, completed: boolean) => Promise<void>
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined)

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [userData, setUserData] = useState<UserData>({
    notes: [],
    syllabus: [],
    tasks: [],
    progress: { overall: 0, topics: [] },
  })
  const [loading, setLoading] = useState(true)

  // Fetch user data whenever user changes
  useEffect(() => {
    if (user) {
      fetchUserData()
    } else {
      // Reset data when user is logged out
      setUserData({
        notes: [],
        syllabus: [],
        tasks: [],
        progress: { overall: 0, topics: [] },
      })
      setLoading(false)
    }
  }, [user])

  // Mock fetch user data function
  const fetchUserData = async () => {
    setLoading(true)
    // TODO: Replace with Firebase Firestore queries
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setUserData({
        notes: mockNotes,
        syllabus: mockSyllabus,
        tasks: mockTasks,
        progress: mockProgress,
      })
    } catch (error) {
      console.error("Fetch user data error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Mock refetch function
  const refetch = async () => {
    await fetchUserData()
  }

  // Mock get note by id function
  const getNoteById = (id: string) => {
    return userData.notes.find((note) => note.id === id) || null
  }

  // Mock save note function
  const saveNote = async (note: any) => {
    setLoading(true)
    // TODO: Replace with Firebase Firestore document set
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      setUserData((prev) => ({
        ...prev,
        notes: prev.notes.some((n) => n.id === note.id)
          ? prev.notes.map((n) => (n.id === note.id ? note : n))
          : [...prev.notes, { ...note, id: `note${prev.notes.length + 1}` }],
      }))
    } catch (error) {
      console.error("Save note error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Mock toggle topic completion function
  const toggleTopicCompletion = async (topicId: string, completed: boolean) => {
    setLoading(true)
    // TODO: Replace with Firebase Firestore document update
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

      // Update syllabus data
      setUserData((prev) => {
        const newSyllabus = prev.syllabus.map((section) => ({
          ...section,
          topics: section.topics.map((topic) => (topic.id === topicId ? { ...topic, completed } : topic)),
        }))

        // Recalculate progress
        const allTopics = newSyllabus.flatMap((section) => section.topics)
        const completedTopics = allTopics.filter((topic) => topic.completed)
        const overallProgress = Math.round((completedTopics.length / allTopics.length) * 100)

        const topicsProgress = newSyllabus.map((section) => {
          const sectionCompletedTopics = section.topics.filter((topic) => topic.completed)
          const sectionProgress = Math.round((sectionCompletedTopics.length / section.topics.length) * 100)
          return {
            name: section.title,
            progress: sectionProgress,
          }
        })

        return {
          ...prev,
          syllabus: newSyllabus,
          progress: {
            overall: overallProgress,
            topics: topicsProgress,
          },
        }
      })
    } catch (error) {
      console.error("Toggle topic completion error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserDataContext.Provider
      value={{
        userData,
        loading,
        refetch,
        getNoteById,
        saveNote,
        toggleTopicCompletion,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

export function useUserData() {
  const context = useContext(UserDataContext)
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider")
  }
  return context
}
