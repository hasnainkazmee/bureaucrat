"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./AuthContext"

type NotificationType = "like" | "comment" | "share" | "incorporate"

type Notification = {
  id: string
  type: NotificationType
  message: string
  read: boolean
  createdAt: string
  postId?: string
  userId?: string
  userName?: string
}

type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load notifications when user changes
  useEffect(() => {
    if (user) {
      // TODO: Fetch from Firestore under notifications collection
      const mockNotifications: Notification[] = [
        {
          id: "notif1",
          type: "like",
          message: "Ahmed Khan liked your note on CSS Flexbox",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          postId: "post1",
          userId: "user2",
          userName: "Ahmed Khan",
        },
        {
          id: "notif2",
          type: "comment",
          message: "Ibrahim Qureshi commented on your Pakistan Affairs subject",
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          postId: "post2",
          userId: "user4",
          userName: "Ibrahim Qureshi",
        },
        {
          id: "notif3",
          type: "incorporate",
          message: "Ayesha Tariq incorporated your Pakistan Affairs subject",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          postId: "post2",
          userId: "user5",
          userName: "Ayesha Tariq",
        },
      ]

      setNotifications(mockNotifications)
    } else {
      setNotifications([])
    }
  }, [user])

  // Calculate unread count
  const unreadCount = notifications.filter((notif) => !notif.read).length

  // Add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "read" | "createdAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    }

    setNotifications((prev) => [newNotification, ...prev])

    // TODO: Save to Firestore under notifications collection
  }

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))

    // TODO: Update in Firestore
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))

    // TODO: Update in Firestore
  }

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([])

    // TODO: Delete from Firestore
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
