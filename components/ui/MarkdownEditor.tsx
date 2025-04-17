"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import ReactMarkdown from "react-markdown"
import { Button } from "./Button"
import { cn } from "@/utils/classNames"

// Dynamic import for SimpleMDE to avoid SSR issues
const SimpleMDE = dynamic(() => import("react-simplemde-editor").then((mod) => mod.default), { ssr: false })

interface MarkdownEditorProps {
  initialValue?: string
  onChange?: (value: string) => void
  autoFocus?: boolean
  placeholder?: string
  className?: string
}

export function MarkdownEditor({
  initialValue = "",
  onChange,
  autoFocus = false,
  placeholder = "Write something...",
  className,
}: MarkdownEditorProps) {
  const [value, setValue] = useState(initialValue)
  const [showPreview, setShowPreview] = useState(false)
  const editorRef = useRef<any>(null)
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // This function preserves the editor's selection state after updates
  const preserveFocus = useCallback(() => {
    if (editorRef.current) {
      const editor = editorRef.current.simpleMde.codemirror
      const cursor = editor.getCursor()
      const scrollInfo = editor.getScrollInfo()

      // Return a function that restores selection and scroll position
      return () => {
        editor.setCursor(cursor)
        editor.scrollTo(scrollInfo.left, scrollInfo.top)
      }
    }
    return () => {}
  }, [])

  // Handle value change with preserved focus
  const handleChange = useCallback(
    (newValue: string) => {
      const restoreFocus = preserveFocus()
      setValue(newValue)

      // Schedule focus restoration after the state update
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current)
      }

      focusTimeoutRef.current = setTimeout(() => {
        restoreFocus()
        if (onChange) {
          onChange(newValue)
        }
      }, 0)
    },
    [onChange, preserveFocus],
  )

  // Track editor instance
  const getEditorInstance = useCallback((editor: any) => {
    editorRef.current = editor
  }, [])

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current)
      }
    }
  }, [])

  // Initialize EasyMDE styles
  useEffect(() => {
    // Optional: Import EasyMDE styles dynamically
    const importEasyMDEStyles = async () => {
      await import("easymde/dist/easymde.min.css")
    }
    importEasyMDEStyles()
  }, [])

  // Updates when initial value changes from props
  useEffect(() => {
    if (initialValue !== value) {
      setValue(initialValue)
    }
  }, [initialValue])

  return (
    <div className={cn("flex h-full w-full overflow-hidden", className)}>
      <div className={cn("transition-all duration-300 ease-in-out h-full", showPreview ? "w-1/2" : "w-full")}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Editor</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>
        <div className="h-[calc(100%-2.5rem)] overflow-auto">
          <SimpleMDE
            value={value}
            onChange={handleChange}
            getCodemirrorInstance={(instance: any) => {
              // Store CodeMirror instance for focus management
              window.CodeMirror = instance
            }}
            getMdeInstance={getEditorInstance}
            options={{
              autofocus: autoFocus,
              spellChecker: false,
              placeholder,
              toolbar: [
                "bold",
                "italic",
                "heading",
                "|",
                "quote",
                "unordered-list",
                "ordered-list",
                "|",
                "link",
                "image",
                "table",
                "code",
                "|",
                "undo",
                "redo",
              ],
              status: ["lines", "words"],
              minHeight: "100%",
              maxHeight: "100%",
            }}
          />
        </div>
      </div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="w-1/2 h-full pl-4 overflow-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-2">
              <h3 className="text-lg font-medium">Preview</h3>
            </div>
            <div className="p-4 glass-card markdown-preview h-[calc(100%-2.5rem)] overflow-auto">
              <ReactMarkdown>{value}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
