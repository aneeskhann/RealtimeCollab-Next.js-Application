'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

type User = {
  id: string
  username: string
  email?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (username: string, email: string, password: string, code: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        const parsedUser: User = JSON.parse(storedUser)
        if (parsedUser?.id) {
          setToken(storedToken)
          setUser(parsedUser)
          console.info('✅ Auth loaded from localStorage')
        } else {
          throw new Error('Corrupt user data')
        }
      }
    } catch (err) {
      console.error('❌ Failed to parse auth data:', err)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const { message } = await res.json()
      throw new Error(message || 'Login failed')
    }

    const { token, user } = await res.json()

    setToken(token)
    setUser(user)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    window.location.href = '/dashboard'
  }

  const signUp = async (
    username: string,
    email: string,
    password: string,
    code: string
  ) => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, code }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Signup failed')
    }

    setToken(data.data.token)
    setUser(data.data.user)

    localStorage.setItem('token', data.data.token)
    localStorage.setItem('user', JSON.stringify(data.data.user))
  }

  const signOut = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/auth/signin'
  }

  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    signIn,
    signOut,
    signUp,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
