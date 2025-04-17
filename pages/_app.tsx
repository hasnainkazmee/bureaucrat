import { AuthProvider } from "@/context/AuthContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { UserDataProvider } from "@/context/UserDataContext"
import { NotificationProvider } from "@/context/NotificationContext"
import { ToastProvider } from "@/components/ui/toast"
import "../app/globals.css"
import type { AppProps } from "next/app"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <UserDataProvider>
          <NotificationProvider>
            <ToastProvider>
              <div className={`${inter.variable} font-sans min-h-screen bg-background text-foreground`}>
                <Component {...pageProps} />
              </div>
            </ToastProvider>
          </NotificationProvider>
        </UserDataProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
