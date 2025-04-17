"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/context/AuthContext"
import { Mail, Lock, ArrowLeft } from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { signUp, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await signUp(email, password)
      router.push("/onboarding")
    } catch (err) {
      setError("Failed to sign up. Please try again.")
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="flex items-center text-secondary-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <GlassCard>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-secondary-foreground mt-2">Sign up to start your CSS prep journey</p>
          </div>

          {error && <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-200">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-white/10 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-white/10 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up with Email"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-secondary-foreground">
              Already have an account?{" "}
              <Link href="#" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
