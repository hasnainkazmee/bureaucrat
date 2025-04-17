import type { ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { MobileNav } from "./MobileNav"
import { SkipLink } from "../ui/SkipLink"
import { ScrollToTop } from "../ui/ScrollToTop"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <SkipLink />
      <Sidebar />
      <main id="main-content" className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
        {children}
      </main>
      <MobileNav />
      <ScrollToTop />
    </div>
  )
}
