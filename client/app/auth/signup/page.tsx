"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Eye, EyeOff, Mail, Lock, User, ArrowLeft, ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { signUp } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const sendCode = async () => {
    if (!formData.email) {
      return toast({ title: "Error", description: "Email is required", variant: "destructive" })
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      })

      if (!res.ok) throw new Error("Send failed")

      setCodeSent(true)
      toast({ title: "Code Sent", description: "Check your inbox for the 6-digit code." })
    } catch (error) {
      toast({ title: "Failed", description: "Could not send verification code.", variant: "destructive" })
    }
  }

  const verifyCode = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: formData.code }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Invalid code")

      setCodeVerified(true)
      toast({ title: "Verified", description: "Email verified successfully." })
    } catch (error) {
      toast({ title: "Verification Failed", description: "Invalid or expired code.", variant: "destructive" })
    }
  }

  const validateForm = () => {
    const { username, email, password, confirmPassword, code } = formData

    if (!username || !email || !password || !confirmPassword || !code) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" })
      return false
    }

    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" })
      return false
    }

    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" })
      return false
    }

    if (!codeVerified) {
      toast({ title: "Error", description: "Please verify your email", variant: "destructive" })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      await signUp(
        formData.username,
        formData.email,
        formData.password,
        formData.code
      )

      toast({ title: "Success", description: "Account created successfully" })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="w-full max-w-md">
        <Card className="glass-effect">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Link href="/" className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <CardTitle className="text-2xl font-bold">Create account</CardTitle>
                <CardDescription>Enter your details to sign up</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputGroup
                id="username"
                name="username"
                label="Username"
                icon={<User className="h-4 w-4 text-gray-400" />}
                value={formData.username}
                onChange={handleChange}
              />

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <div className="relative flex">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <Button type="button" variant="outline" className="ml-2" onClick={sendCode}>
                    Send Code
                  </Button>
                </div>
              </div>

              {codeSent && (
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium flex items-center gap-2">
                    Verification Code
                    {codeVerified && <ShieldCheck className="text-green-500 h-4 w-4" />}
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      id="code"
                      name="code"
                      type="text"
                      placeholder="6-digit code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                    />
                    <Button type="button" onClick={verifyCode} variant="outline">
                      Verify
                    </Button>
                  </div>
                </div>
              )}

              <PasswordInput
                id="password"
                name="password"
                label="Password"
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
                value={formData.password}
                onChange={handleChange}
              />

              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                show={showConfirmPassword}
                toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// 🔁 REUSABLE COMPONENTS

const InputGroup = ({
  id,
  name,
  label,
  icon,
  value,
  onChange,
}: {
  id: string
  name: string
  label: string
  icon: React.ReactNode
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-3">{icon}</span>
      <Input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="pl-10"
        required
      />
    </div>
  </div>
)

const PasswordInput = ({
  id,
  name,
  label,
  show,
  toggle,
  value,
  onChange,
}: {
  id: string
  name: string
  label: string
  show: boolean
  toggle: () => void
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium">{label}</label>
    <div className="relative">
      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        placeholder="Enter password"
        value={value}
        onChange={onChange}
        className="pl-10 pr-10"
        required
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </div>
)
