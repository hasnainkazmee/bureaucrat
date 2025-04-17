"use client"

import { type HTMLAttributes, forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/classNames"

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined"
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({ className, variant = "default", ...props }, ref) => {
  const baseStyles = cn(
    "glass-card overflow-hidden p-6",
    {
      "border border-white/20": variant === "outlined",
    },
    className,
  )

  return (
    <motion.div
      className={baseStyles}
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    />
  )
})

GlassCard.displayName = "GlassCard"

export { GlassCard }
