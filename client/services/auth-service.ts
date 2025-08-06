// Authentication service for handling user auth operations
export interface User {
  _id: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken')
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Sign in failed")
    }

    const data = await response.json()
    
    // Store token in localStorage
    if (data.data?.token) {
      localStorage.setItem('authToken', data.data.token)
    }

    return data.data
  }

 async signUp(username: string, email: string, password: string, code: string): Promise<AuthResponse> {
  const response = await fetch(`${this.baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, code }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Sign up failed")
  }

  const data = await response.json()

  if (data.data?.token) {
    localStorage.setItem('authToken', data.data.token)
  }

  return data.data
}


  async signOut(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('authToken')
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: this.getAuthHeaders(),
      })
      
      if (!response.ok) {
        localStorage.removeItem('authToken')
        return null
      }
      
      const data = await response.json()
      return data.data
    } catch {
      localStorage.removeItem('authToken')
      return null
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
