"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { FileText, PieChart, BookOpen } from "lucide-react"

export default function LandingPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">CSS Prep</h1>
        <Link href="/signup">
          <Button variant="outline">Sign Up</Button>
        </Link>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-6 md:px-10 max-w-7xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Ace Your CSS Prep with Smart Study Tools</h1>
            <p className="text-xl md:text-2xl text-secondary-foreground mb-10">
              Organize, track, and succeed—your CSS exam prep starts here
            </p>
            <Link href="/signup">
              <Button size="lg" className="glow-primary">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp}>
              <GlassCard className="h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/20 mb-4">
                    <PieChart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Track Your Progress</h3>
                  <p className="text-secondary-foreground">
                    Visualize your learning journey with intuitive progress tracking and analytics.
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <GlassCard className="h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/20 mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Markdown Notes</h3>
                  <p className="text-secondary-foreground">
                    Capture complex concepts with a powerful Obsidian-inspired markdown editor.
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <GlassCard className="h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/20 mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Custom Syllabus</h3>
                  <p className="text-secondary-foreground">
                    Create and follow a personalized study syllabus tailored to your exam needs.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <footer className="py-6 px-6 text-center text-sm text-secondary-foreground border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>© 2023 CSS Prep. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
