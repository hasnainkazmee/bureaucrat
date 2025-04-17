"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Check, Trash2 } from "lucide-react"
import { useNotifications } from "@/context/NotificationContext"
import { Button } from "./Button"
import { useRouter } from "next/navigation"

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications()
  const router = useRouter()

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)

    // Navigate to the relevant post if postId exists
    if (notification.postId) {
      // In a real app, this would navigate to the specific post
      // router.push(`/community/post/${notification.postId}`)

      // For now, just navigate to the community page
      router.push("/community")
    }

    setIsOpen(false)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `${diffInDays} days ago`
    }

    return date.toLocaleDateString()
  }

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-muted transition-colors"
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              className="absolute right-0 mt-2 w-80 glass-card z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-3 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-medium">Notifications</h3>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  {notifications.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-xs">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-secondary-foreground">
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-white/10 hover:bg-muted/50 cursor-pointer transition-colors ${
                          !notification.read ? "bg-primary/5" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm">{notification.message}</p>
                          {!notification.read && <div className="w-2 h-2 rounded-full bg-primary mt-1" />}
                        </div>
                        <p className="text-xs text-secondary-foreground mt-1">{formatDate(notification.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
