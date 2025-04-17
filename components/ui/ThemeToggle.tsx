"use client"

import { useTheme } from "@/context/ThemeContext"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { Button } from "./Button"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme} className="relative">
      <div className="relative w-4 h-4">
        <motion.div
          initial={{ scale: theme === "dark" ? 1 : 0 }}
          animate={{ scale: theme === "dark" ? 1 : 0, opacity: theme === "dark" ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon className="w-4 h-4" />
        </motion.div>

        <motion.div
          initial={{ scale: theme === "light" ? 1 : 0 }}
          animate={{ scale: theme === "light" ? 1 : 0, opacity: theme === "light" ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="w-4 h-4" />
        </motion.div>
      </div>

      <span className="ml-2">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
    </Button>
  )
}
