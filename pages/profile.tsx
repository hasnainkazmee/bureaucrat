"use client"

import type React from "react"

import { useState } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/context/AuthContext"
import { Calendar, BookOpen, Mail, UserIcon, Check, Edit } from "lucide-react"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    examDate: "",
    goals: "",
  })

  // Update profileData when user data is loaded
  useState(() => {
    if (user) {
      setProfileData({
        name: user.name,
        examDate: user.examDate,
        goals: user.goals,
      })
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Save profile data to Firebase
    console.log("Saving profile data:", profileData)

    setIsEditing(false)
  }

  if (loading || !user) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary-foreground">Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-secondary-foreground">Manage your account details</p>
      </header>

      <GlassCard className="max-w-2xl">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold">Account Information</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Done
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={profileData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-muted border border-white/10 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="examDate" className="block text-sm font-medium mb-1">
                Exam Date
              </label>
              <input
                id="examDate"
                name="examDate"
                type="date"
                value={profileData.examDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-muted border border-white/10 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="goals" className="block text-sm font-medium mb-1">
                Study Goals
              </label>
              <textarea
                id="goals"
                name="goals"
                rows={4}
                value={profileData.goals}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-muted border border-white/10 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex justify-end">
              <Button type="button" variant="outline" className="mr-2" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-2 rounded-md">
                <UserIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-secondary-foreground">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-2 rounded-md">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-secondary-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-2 rounded-md">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-secondary-foreground">Exam Date</p>
                <p className="font-medium">{user.examDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-2 rounded-md">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-secondary-foreground">Study Goals</p>
                <p className="font-medium">{user.goals}</p>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </MainLayout>
  )
}
