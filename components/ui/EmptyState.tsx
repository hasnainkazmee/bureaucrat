"use client"

import type { ReactNode } from "react"
import { cn } from "@/utils/classNames"
import { Button } from "./Button"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  children?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action, className, children }: EmptyStateProps) {
  return (
    <div className={cn("py-12 text-center", className)}>
      <Icon className="w-16 h-16 mx-auto mb-6 text-secondary-foreground opacity-50" />
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-secondary-foreground mb-6 max-w-md mx-auto">{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
      {children}
    </div>
  )
}
