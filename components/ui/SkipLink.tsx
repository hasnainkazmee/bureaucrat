"use client"

import { useState } from "react"
import { cn } from "@/utils/classNames"

export function SkipLink() {
  const [focused, setFocused] = useState(false)

  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none",
        focused ? "focus:ring-2 focus:ring-offset-2 focus:ring-primary" : "",
      )}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      Skip to content
    </a>
  )
}
