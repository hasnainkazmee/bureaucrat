"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, BookOpen, FileText, PieChart, Globe } from "lucide-react"
import { cn } from "@/utils/classNames"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/syllabus", label: "Syllabus", icon: BookOpen },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/community", label: "Community", icon: Globe },
  { href: "/progress", label: "Progress", icon: PieChart },
]

export function MobileNav() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-card border-t border-white/10 px-2 py-3 flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-2 py-1 rounded-md transition-colors",
                isActive ? "text-primary" : "text-secondary-foreground",
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
              {isActive && (
                <motion.div className="absolute bottom-0 w-1 h-1 bg-primary rounded-full" layoutId="activeIndicator" />
              )}
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
