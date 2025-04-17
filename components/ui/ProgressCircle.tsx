"use client"

import { type HTMLAttributes, forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/classNames"

interface ProgressCircleProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

const ProgressCircle = forwardRef<HTMLDivElement, ProgressCircleProps>(
  ({ className, value, size = "md", showLabel = true, ...props }, ref) => {
    const sizeMap = {
      sm: {
        container: "w-16 h-16",
        stroke: 2,
        text: "text-lg",
      },
      md: {
        container: "w-24 h-24",
        stroke: 3,
        text: "text-xl",
      },
      lg: {
        container: "w-32 h-32",
        stroke: 4,
        text: "text-2xl",
      },
    }

    const diameter = 100
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (value / 100) * circumference

    const variants = {
      hidden: { strokeDashoffset: circumference },
      visible: {
        strokeDashoffset,
        transition: { duration: 1, ease: "easeInOut" },
      },
    }

    return (
      <div
        className={cn("relative inline-flex items-center justify-center", sizeMap[size].container, className)}
        ref={ref}
        {...props}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-muted"
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={sizeMap[size].stroke}
          />
          {/* Progress circle */}
          <motion.circle
            className="text-primary"
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={sizeMap[size].stroke}
            strokeDasharray={circumference}
            initial="hidden"
            animate="visible"
            variants={variants}
            strokeLinecap="round"
            transform="rotate(-90, 50, 50)"
          />
        </svg>
        {showLabel && (
          <div className={cn("absolute inset-0 flex items-center justify-center font-bold", sizeMap[size].text)}>
            {value}%
          </div>
        )}
      </div>
    )
  },
)

ProgressCircle.displayName = "ProgressCircle"

export { ProgressCircle }
