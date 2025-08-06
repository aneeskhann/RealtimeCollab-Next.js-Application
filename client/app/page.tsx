"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Video, Users, MessageSquare, Shield, Zap, Globe, ArrowRight, Github } from "lucide-react"

export default function Home() {
  const router = useRouter()

  const features = [
    {
      icon: Video,
      title: "HD Video Conferencing",
      description: "Crystal clear video calls with up to 100 participants, screen sharing, and recording capabilities.",
    },
    {
      icon: Users,
      title: "Collaborative Boards",
      description: "Real-time whiteboarding and brainstorming with infinite canvas and smart drawing tools.",
    },
    {
      icon: MessageSquare,
      title: "Instant Messaging",
      description: "Chat channels, direct messages, and file sharing to keep your team connected.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "End-to-end encryption, SSO integration, and compliance with industry standards.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for performance with sub-second loading times and real-time synchronization.",
    },
    {
      icon: Globe,
      title: "Open Source",
      description: "Fully open source and self-hostable. Customize and extend to fit your team's needs.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b bg-background/80 shadow-sm border-border dark:border-white/10">
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
            <a href="#getting-started" className="text-muted-foreground hover:text-primary transition-colors">
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

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              🚀 Open Source • Self-Hostable • Free Forever
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent">
              The Future of
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Remote Collaboration
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              An open source platform for HD video conferencing, real-time collaborative boards, and powerful
              productivity tools. Host it yourself and customize it to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => router.push("/auth/signin")}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">MIT Licensed • Self-hosted • No vendor lock-in</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-card-foreground">
              Everything you need to collaborate effectively
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to enhance productivity and streamline remote work, all open source
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="getting-started" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Get started in minutes</h2>
            <p className="text-xl text-muted-foreground">Simple setup, powerful results</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Clone & Install</h3>
              <p className="text-muted-foreground">
                Clone the repository and install dependencies with a single command
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Configure</h3>
              <p className="text-muted-foreground">
                Set up your environment variables and customize your workspace settings
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Deploy</h3>
              <p className="text-muted-foreground">
                Deploy to your preferred hosting platform or run locally for development
              </p>
            </div>
          </div>

         {/* Installation Code Block */}
<div className="mt-16 max-w-2xl mx-auto">
  <div className="bg-secondary border border-border dark:border-white/10 rounded-lg p-6 font-mono text-sm shadow-lg">
    <div className="text-muted-foreground mb-2"># Clone the repository</div>
    <div className="text-foreground mb-4">git clone https://github.com/your-org/collabspace.git</div>
    <div className="text-muted-foreground mb-2"># Install dependencies</div>
    <div className="text-foreground mb-4">npm install</div>
    <div className="text-muted-foreground mb-2"># Start development server</div>
    <div className="text-foreground">npm run dev</div>
  </div>
</div>

        </div>
      </section>

      {/* Open Source Benefits Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-card-foreground">Why Open Source?</h2>
            <p className="text-xl text-muted-foreground">Built by the community, for the community</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">Full Control</h3>
              <p className="text-muted-foreground">Host on your own infrastructure with complete data ownership</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">Community Driven</h3>
              <p className="text-muted-foreground">Contribute features, report bugs, and shape the roadmap</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">No Vendor Lock-in</h3>
              <p className="text-muted-foreground">Customize, extend, and integrate without restrictions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">Always Free</h3>
              <p className="text-muted-foreground">MIT licensed - use it however you want, forever</p>
            </div>
          </div>
        </div>
      </section>

      

      {/* Footer */}
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
