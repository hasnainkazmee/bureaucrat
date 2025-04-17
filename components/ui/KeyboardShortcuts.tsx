"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Keyboard, X } from "lucide-react"
import { Button } from "./Button"

interface ShortcutGroup {
  title: string
  shortcuts: {
    keys: string[]
    description: string
  }[]
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["g", "h"], description: "Go to Dashboard" },
      { keys: ["g", "s"], description: "Go to Syllabus" },
      { keys: ["g", "n"], description: "Go to Notes" },
      { keys: ["g", "c"], description: "Go to Community" },
      { keys: ["g", "p"], description: "Go to Progress" },
    ],
  },
  {
    title: "Notes",
    shortcuts: [
      { keys: ["n"], description: "New note" },
      { keys: ["Ctrl/⌘", "s"], description: "Save note" },
      { keys: ["Ctrl/⌘", "Enter"], description: "Preview note" },
      { keys: ["Esc"], description: "Exit preview" },
    ],
  },
  {
    title: "Community",
    shortcuts: [
      { keys: ["l"], description: "Like/unlike post" },
      { keys: ["c"], description: "Comment on post" },
      { keys: ["i"], description: "Incorporate content" },
      { keys: ["s"], description: "Share post" },
    ],
  },
]

export function KeyboardShortcutsButton() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle shortcuts dialog with ? key
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setIsOpen((prev) => !prev)
      }

      // Close with Escape key
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setIsOpen(true)}
        aria-label="Keyboard shortcuts"
      >
        <Keyboard className="w-4 h-4" />
        <span className="sr-only md:not-sr-only">Shortcuts</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setIsOpen(false)} />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="glass-card w-full max-w-2xl max-h-[80vh] overflow-auto"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
                  <button onClick={() => setIsOpen(false)} className="p-1 rounded-md hover:bg-white/10">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-secondary-foreground mb-6">
                    Press <kbd className="px-2 py-1 bg-muted rounded">?</kbd> anywhere to show this dialog.
                  </p>

                  <div className="space-y-6">
                    {shortcutGroups.map((group) => (
                      <div key={group.title}>
                        <h3 className="text-lg font-bold mb-2">{group.title}</h3>
                        <div className="space-y-2">
                          {group.shortcuts.map((shortcut, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm">{shortcut.description}</span>
                              <div className="flex items-center gap-1">
                                {shortcut.keys.map((key, keyIndex) => (
                                  <React.Fragment key={keyIndex}>
                                    <kbd className="px-2 py-1 bg-muted rounded text-xs">{key}</kbd>
                                    {keyIndex < shortcut.keys.length - 1 && <span>+</span>}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
