"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { MessageSquare, Github, Lightbulb, Handshake, ShieldCheck, Code, HeartHandshake, Scale } from "lucide-react"

export default function AboutPage() {
  const router = useRouter()

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously exploring new ideas and technologies to push the boundaries of collaboration.",
    },
    {
      icon: Handshake,
      title: "Community",
      description: "Fostering a vibrant and inclusive community where everyone can contribute and grow.",
    },
    {
      icon: ShieldCheck,
      title: "Transparency",
      description: "Operating with openness in development, decision-making, and communication.",
    },
    {
      icon: Code,
      title: "Quality",
      description: "Committed to building robust, reliable, and user-friendly software.",
    },
    {
      icon: HeartHandshake,
      title: "Accessibility",
      description:
        "Ensuring our tools are usable and beneficial for everyone, regardless of their background or ability.",
    },
    {
      icon: Scale,
      title: "Empowerment",
      description: "Giving users full control and flexibility to adapt the platform to their unique needs.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Copied from main page for consistency */}
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
            <a href="/#getting-started" className="text-muted-foreground hover:text-primary transition-colors">
              Getting Started
            </a>
            <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About Us
            </a>
          </nav>
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" size="sm">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="default" onClick={() => router.push("/auth/signin")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* About Hero Section */}
      <section className="relative py-20 lg:py-24 overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 relative text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Building the Future of Collaboration, Together
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            CollabSpace is an open-source initiative dedicated to creating powerful, flexible, and community-driven
            collaboration tools for everyone.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-card-foreground">Our Story</h2>
            <p className="text-xl text-muted-foreground">The journey of CollabSpace</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                CollabSpace was born from my personal frustration with existing collaboration tools. I found them either
                too expensive, too restrictive, or lacking in privacy. My core belief is that great software should be
                accessible, customizable, and truly owned by its users.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I embarked on a mission to democratize remote collaboration. My goal is to provide a robust, open-source
                platform that teams can truly make their own. Whether you're a small startup, a large enterprise, or an
                educational institution, CollabSpace is designed to adapt to your unique needs.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="/placeholder.svg?height=300&width=500"
                alt="Collaboration illustration"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border shadow-lg p-6 text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">🎯</span>
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To democratize remote collaboration by providing a powerful, open-source platform that teams can truly
                  make their own, fostering a world where every team has access to effective tools.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-lg p-6 text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">✨</span>
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To envision a future where open-source collaboration platforms are the standard, not the exception,
                  empowering teams globally with customizable and privacy-respecting solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

     {/* Founder Section (Replaced Team Section) */}
      <section className="py-20  bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Meet the Founder</h2>
            <p className="text-xl text-muted-foreground">The individual behind CollabSpace</p>
          </div>
          <div className="max-w-md mx-auto">
            <Card className="border shadow-lg text-center">
              <CardContent className="pt-6">
                <img
                  src="/placeholder.svg?height=160&width=160"
                  alt="Your Name"
                  className="rounded-full w-32 h-32 mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-card-foreground">Muhammad</h3> {/* Replace with your name */}
                <p className="text-base text-muted-foreground">Founder & Lead Developer</p> {/* Adjust your role */}
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                  I started CollabSpace with a passion for open-source and a belief that powerful collaboration tools
                  should be accessible to everyone. My goal is to build a robust, community-driven platform that
                  empowers teams worldwide.
                </p>
                <div className="flex justify-center gap-3 mt-6">
                  <Button variant="ghost" size="icon" aria-label="GitHub">
                    <Github className="h-6 w-6" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="LinkedIn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-linkedin"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

     

    

      {/* Footer - Copied from main page for consistency */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CollabSpace</h3>
              <p className="text-muted-foreground mb-4">Open source remote collaboration platform.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-secondary-foreground transition-colors">
                    Self-Hosting Guide
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-secondary-foreground transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary-foreground transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary-foreground transition-colors">
                    Contributing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary-foreground transition-colors">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-secondary-foreground transition-colors">
                    Getting Started
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary-foreground transition-colors">
                    Examples
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary-foreground transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CollabSpace. Released under the MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
