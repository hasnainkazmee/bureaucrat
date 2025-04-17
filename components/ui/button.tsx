"use client"

import { type ButtonHTMLAttributes, forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/classNames"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      {
        "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
        "border border-border bg-transparent hover:bg-muted hover:text-accent-foreground": variant === "outline",
        "hover:bg-muted hover:text-accent-foreground": variant === "ghost",
        "text-primary underline-offset-4 hover:underline": variant === "link",
        "h-9 px-4 py-2": size === "default",
        "h-8 px-3 text-sm": size === "sm",
        "h-11 px-8": size === "lg",
      },
      className,
    )

    return (
      <motion.button
        className={baseStyles}
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      />
    )
  },
)

Button.displayName = "Button"

export { Button }
