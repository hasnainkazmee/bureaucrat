"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { useTheme } from "@/context/ThemeContext"
import { useAuth } from "@/context/AuthContext"
import { LogOut, Globe, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { addToast } from "@/utils/toast"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { EmptyState } from "@/components/ui/EmptyState"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

// Type for shared content
type SharedContent = {
  id: string
  type: "note" | "notes" | "subject" | "syllabus"
  title: string
  sharedAt: string
  likes: number
  comments: number
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { signOut } = useAuth()
  const router = useRouter()
  const [sharedContent, setSharedContent] = useState<SharedContent[]>([])
  const [loading, setLoading] = useState(false)

  // Load mock shared content
  useEffect(() => {
    const loadSharedContent = async () => {
      setLoading(true)
      // TODO: Fetch from Firestore under communityPosts where userId === user.id
      const mockSharedContent: SharedContent[] = [
        {
          id: "1",
          type: "note",
          title: "CSS Flexbox Notes",
          sharedAt: "2023-11-10T09:15:00Z",
          likes: 24,
          comments: 3,
        },
        {
          id: "2",
          type: "subject",
          title: "Pakistan Affairs",
          sharedAt: "2023-11-09T11:30:00Z",
          likes: 37,
          comments: 5,
        },
        {
          id: "3",
          type: "notes",
          title: "Current Affairs Collection",
          sharedAt: "2023-11-15T08:45:00Z",
          likes: 15,
          comments: 0,
        },
      ]

      setSharedContent(mockSharedContent)
      setLoading(false)
    }

    loadSharedContent()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Handle deleting shared content
  const handleDeleteSharedContent = (id: string) => {
    setSharedContent((prev) => prev.filter((item) => item.id !== id))

    // TODO: Delete from Firestore under communityPosts
    console.log("Deleted shared content:", id)

    // Add toast notification
    addToast("Content removed from Community Hub", "success")
  }

  // Add a function to view shared content details
  const handleViewSharedContent = (id: string) => {
    // Find the content
    const content = sharedContent.find((item) => item.id === id)
    if (!content) return

    // TODO: Navigate to the community post
    // In a real implementation, this would navigate to the specific post in the Community Hub
    console.log("Viewing shared content:", content)

    // For now, just show an alert with details
    alert(`
    Title: ${content.title}
    Type: ${content.type}
    Shared on: ${formatDate(content.sharedAt)}
    Engagement: ${content.likes} likes, ${content.comments} comments
  `)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Replace loading state with LoadingSpinner
  if (loading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading profile..." />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-secondary-foreground">Customize your experience</p>
      </header>

      <div className="max-w-2xl">
        <GlassCard className="mb-6">
          <h2 className="text-xl font-bold mb-6">Appearance</h2>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className="text-sm text-secondary-foreground">Choose between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </GlassCard>

        <GlassCard className="mb-6">
          <h2 className="text-xl font-bold mb-6">Manage Shared Content</h2>

          {sharedContent.length === 0 ? (
            <div className="py-6">
              <EmptyState
                icon={Globe}
                title="No shared content"
                description="You haven't shared any content to the Community Hub yet"
                action={{
                  label: "Go to Notes",
                  onClick: () => router.push("/notes"),
                }}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {sharedContent.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-[#2D2D2D]/50 rounded-md"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <div className="flex items-center">
                      <div className="px-2 py-0.5 text-xs rounded bg-primary/20 text-primary mr-2">
                        {item.type === "note"
                          ? "Note"
                          : item.type === "notes"
                            ? "Notes"
                            : item.type === "subject"
                              ? "Subject"
                              : "Syllabus"}
                      </div>
                      <h3 className="font-medium">{item.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-secondary-foreground">Shared on {formatDate(item.sharedAt)}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-secondary-foreground">{item.likes} likes</span>
                        <span className="text-xs text-secondary-foreground">{item.comments} comments</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary-foreground hover:bg-primary/80"
                        onClick={() => handleViewSharedContent(item.id)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDeleteSharedContent(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <h2 className="text-xl font-bold mb-6">Account</h2>

          <div>
            <Button
              variant="outline"
              className="text-red-500 border-red-500/20 hover:bg-red-500/10"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  )
}
