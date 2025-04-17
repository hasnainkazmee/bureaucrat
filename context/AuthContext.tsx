"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockUser } from "@/utils/mockData"

// Types
type User = {
  id: string
  name: string
  email: string
  examDate: string
  goals: string
} | null

type AuthContextType = {
  user: User
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  // Simulate authentication loading
  useEffect(() => {
    // TODO: Replace with Firebase Auth onAuthStateChanged
    const timer = setTimeout(() => {
      setUser(null) // Start with no user
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Mock login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    // TODO: Replace with Firebase Auth signInWithEmailAndPassword
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setUser(mockUser)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Mock sign up function
  const signUp = async (email: string, password: string) => {
    setLoading(true)
    // TODO: Replace with Firebase Auth createUserWithEmailAndPassword
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setUser(mockUser)
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Mock sign out function
  const signOut = async () => {
    setLoading(true)
    // TODO: Replace with Firebase Auth signOut
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      setUser(null)
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, signUp, signOut }}>{children}</AuthContext.Provider>
}

// Hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
