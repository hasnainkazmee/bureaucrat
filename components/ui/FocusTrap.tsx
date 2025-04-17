"use client"

import { useRef, useEffect, type ReactNode } from "react"

interface FocusTrapProps {
  children: ReactNode
  active?: boolean
  initialFocus?: boolean
}

export function FocusTrap({ children, active = true, initialFocus = false }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialFocusRef = useRef(initialFocus)

  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    if (!container) return

    // Get all focusable elements
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Set initial focus
    if (initialFocusRef.current && firstElement) {
      firstElement.focus()
    }

    // Handle tab key to trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        // If shift + tab and on first element, move to last element
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // If tab and on last element, move to first element
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    // Save previous active element to restore focus later
    const previousActiveElement = document.activeElement as HTMLElement

    // Add event listener
    document.addEventListener("keydown", handleKeyDown)

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      // Restore focus when unmounted
      if (previousActiveElement) {
        previousActiveElement.focus()
      }
    }
  }, [active])

  return <div ref={containerRef}>{children}</div>
}
