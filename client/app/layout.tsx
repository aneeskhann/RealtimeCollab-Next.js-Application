import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth"
import { TooltipProvider } from "@/components/ui/tooltip" // ✅ Import TooltipProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CollabSpace V1 - Real-Time Collaboration",
  description: "Simple real-time communication and collaboration platform",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="collabspace-theme"
        >
          <AuthProvider>
            <TooltipProvider> {/* ✅ Fix applied here */}
              {children}
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
