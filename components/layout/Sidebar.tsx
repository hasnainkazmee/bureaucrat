"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/utils/classNames"
import { Home, BookOpen, FileText, PieChart, User, Settings, Menu, X, Globe } from "lucide-react"
import { NotificationDropdown } from "@/components/ui/NotificationDropdown"
import { KeyboardShortcutsButton } from "@/components/ui/KeyboardShortcuts"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/syllabus", label: "Syllabus", icon: BookOpen },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/community", label: "Community", icon: Globe }, // Added Community
  { href: "/progress", label: "Progress", icon: PieChart },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const closeMobileMenu = () => {
    setIsMobileOpen(false)
  }

  const sidebar = (
    <div className={cn("flex flex-col h-full bg-card glass", className)}>
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-primary">CSS Prep</h2>
            <p className="text-sm text-secondary-foreground">Study Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationDropdown />
            <KeyboardShortcutsButton />
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link href={item.href} onClick={closeMobileMenu}>
                  <motion.div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                      isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                    )}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-secondary-foreground">© 2023 CSS Prep</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-primary md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu} />
            <motion.div
              className="absolute top-0 left-0 w-64 h-full"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {sidebar}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-64 h-screen sticky top-0">{sidebar}</div>
    </>
  )
}
