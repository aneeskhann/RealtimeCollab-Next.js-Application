"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export const LandingHeader = () => {
  const router = useRouter()

  return (
    <header className="border-b glass-effect sticky top-0 z-50 bg-background/70 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">CS</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">CollabSpace</h1>
          </div>
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">
              Testimonials
            </a>
          </nav>
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="default" onClick={() => router.push("/auth/signin")}>
              Sign In
            </Button>
          </div>
        </div>
      </header>
  )
}
