"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/Button"
import { MarkdownEditor } from "@/components/ui/MarkdownEditor"
import { useUserData } from "@/context/UserDataContext"
import { Plus, Search, FileText, Save, Share2, X, CheckSquare, Square, Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { EmptyState } from "@/components/ui/EmptyState"
import { useToast } from "@/components/ui/use-toast"

export default function NotesPage() {
  const router = useRouter()
  const { userData, loading, saveNote, user } = useUserData()
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [noteTitle, setNoteTitle] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast: addToast } = useToast()

  // State for multi-select and sharing
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false)
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [shareType, setShareType] = useState<"single" | "multiple">("single")
  const [shareNote, setShareNote] = useState<any>(null)

  // Get the currently selected note
  const selectedNote = selectedNoteId ? userData.notes.find((note) => note.id === selectedNoteId) : null

  // Filter notes based on search query
  const filteredNotes = userData.notes.filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // Handle creating a new note
  const handleNewNote = () => {
    setSelectedNoteId(null)
    setNoteTitle("New Note")
    setNoteContent("# New Note\n\nStart writing here...")
  }

  // Handle selecting a note
  const handleSelectNote = (noteId: string) => {
    if (isMultiSelectMode) {
      // Toggle selection in multi-select mode
      if (selectedNotes.includes(noteId)) {
        setSelectedNotes((prev) => prev.filter((id) => id !== noteId))
      } else {
        setSelectedNotes((prev) => [...prev, noteId])
      }
    } else {
      // Normal selection mode
      const note = userData.notes.find((n) => n.id === noteId)
      if (note) {
        setSelectedNoteId(noteId)
        setNoteTitle(note.title)
        setNoteContent(note.content)
      }
    }
  }

  // Handle saving a note
  const handleSaveNote = async () => {
    setIsSaving(true)
    try {
      const noteToSave = selectedNote
        ? {
            ...selectedNote,
            title: noteTitle,
            content: noteContent,
            updatedAt: new Date().toISOString(),
          }
        : {
            id: `note${userData.notes.length + 1}`,
            title: noteTitle,
            content: noteContent,
            updatedAt: new Date().toISOString(),
            tags: [],
          }

      await saveNote(noteToSave)

      // If this was a new note, select it after saving
      if (!selectedNoteId) {
        setSelectedNoteId(noteToSave.id)
      }

      // Add toast notification
      addToast("Note saved successfully", "success")
    } catch (error) {
      console.error("Error saving note:", error)
      addToast("Failed to save note. Please try again.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  // Toggle multi-select mode
  const handleToggleMultiSelect = () => {
    setIsMultiSelectMode(!isMultiSelectMode)
    setSelectedNotes([]) // Clear selections when toggling
  }

  // Handle sharing a single note
  const handleShareSingleNote = () => {
    if (!selectedNote) return

    setShareType("single")
    setShareNote(selectedNote)
    setIsShareModalOpen(true)
  }

  // Handle sharing multiple notes
  const handleShareMultipleNotes = () => {
    if (selectedNotes.length === 0) return

    const notesToShare = userData.notes.filter((note) => selectedNotes.includes(note.id))
    setShareType("multiple")
    setShareNote(notesToShare)
    setIsShareModalOpen(true)
  }

  // Handle confirming share
  const handleConfirmShare = () => {
    // TODO: Save to Firestore under communityPosts collection
    const postData = {
      id: `post-${Date.now()}`,
      userId: user?.id || "anonymous",
      userName: user?.name || "Anonymous User",
      type: shareType === "single" ? "note" : "notes",
      title: shareType === "single" ? shareNote.title : `${user?.name}'s Note Collection`,
      preview:
        shareType === "single"
          ? shareNote.content.substring(0, 100) + (shareNote.content.length > 100 ? "..." : "")
          : `${shareNote.length} notes on various topics`,
      content: shareType === "single" ? { title: shareNote.title, text: shareNote.content } : shareNote,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    }

    console.log("Sharing to community:", postData)

    // Show success message with toast
    const successMessage =
      shareType === "single"
        ? `"${shareNote.title}" has been shared to the Community Hub!`
        : `${shareNote.length} notes have been shared to the Community Hub!`

    addToast(successMessage, "success")

    // Reset state
    setIsShareModalOpen(false)
    setSelectedNotes([])
    setIsMultiSelectMode(false)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading notes..." />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)]">
        {/* Notes Sidebar */}
        <div className="w-full md:w-64 shrink-0 md:mr-6 mb-6 md:mb-0 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Notes</h1>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleToggleMultiSelect} variant={isMultiSelectMode ? "default" : "ghost"}>
                {isMultiSelectMode ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              </Button>
              <Button size="sm" onClick={handleNewNote}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted border border-white/10 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Multi-select actions */}
          {isMultiSelectMode && (
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-secondary-foreground">{selectedNotes.length} selected</span>
              {selectedNotes.length > 0 && (
                <Button size="sm" onClick={handleShareMultipleNotes}>
                  <Share2 className="w-3.5 h-3.5 mr-1" />
                  Share
                </Button>
              )}
            </div>
          )}

          <div className="flex-1 overflow-auto glass-card">
            {filteredNotes.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={FileText}
                  title="No notes found"
                  description={searchQuery ? "Try adjusting your search query" : "You haven't created any notes yet"}
                  action={
                    searchQuery
                      ? undefined
                      : {
                          label: "Create Your First Note",
                          onClick: handleNewNote,
                        }
                  }
                />
              </div>
            ) : (
              <div className="space-y-2 p-2">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      (isMultiSelectMode ? selectedNotes.includes(note.id) : selectedNoteId === note.id)
                        ? "bg-primary/20 border border-primary/30"
                        : "hover:bg-muted/70"
                    }`}
                    onClick={() => handleSelectNote(note.id)}
                  >
                    <div className="flex items-start">
                      {isMultiSelectMode ? (
                        <div className="flex-shrink-0 w-4 h-4 mt-1 mr-2">
                          {selectedNotes.includes(note.id) ? (
                            <CheckSquare className="w-4 h-4 text-primary" />
                          ) : (
                            <Square className="w-4 h-4 text-secondary-foreground" />
                          )}
                        </div>
                      ) : (
                        <FileText className="w-4 h-4 mt-1 mr-2 text-secondary-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{note.title}</h3>
                        <p className="text-xs text-secondary-foreground">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col glass-card overflow-hidden">
          {selectedNoteId || noteTitle ? (
            <>
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="bg-transparent text-xl font-bold border-none focus:outline-none focus:ring-0 w-full"
                  placeholder="Note Title"
                />
                <div className="flex items-center gap-2">
                  <Button onClick={handleShareSingleNote} disabled={!selectedNoteId} variant="ghost" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button onClick={handleSaveNote} disabled={isSaving} size="sm">
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                <MarkdownEditor
                  initialValue={noteContent}
                  onChange={setNoteContent}
                  className="h-full"
                  autoFocus={true}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-secondary-foreground" />
                <h2 className="text-xl font-bold mb-2">No Note Selected</h2>
                <p className="text-secondary-foreground mb-4">Select a note from the sidebar or create a new one</p>
                <Button onClick={handleNewNote}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Note
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setIsShareModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">Share to Community Hub</h3>
                  <p className="text-secondary-foreground">
                    {shareType === "single"
                      ? "Share this note with the CSS community"
                      : `Share ${selectedNotes.length} notes with the CSS community`}
                  </p>
                </div>
                <button onClick={() => setIsShareModalOpen(false)} className="p-1 text-secondary-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="p-4 bg-[#1E1E1E] rounded-md">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-primary" />
                    <p className="font-medium">
                      {shareType === "single" ? shareNote?.title : `${selectedNotes.length} notes selected`}
                    </p>
                  </div>
                  {shareType === "multiple" && (
                    <ul className="mt-2 ml-7 text-sm text-secondary-foreground max-h-32 overflow-auto">
                      {shareNote?.map((note: any) => (
                        <li key={note.id} className="list-disc mb-1">
                          {note.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsShareModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  )
}
