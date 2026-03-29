import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// -------- Local user types (Firebase-free) --------

interface LocalUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface StoredUser extends LocalUser {
  password: string
}

interface AuthContextType {
  user: LocalUser | null
  userRole: 'admin' | 'user' | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

// -------- localStorage helpers --------

const CURRENT_USER_KEY = 'auth_user'
const ALL_USERS_KEY = 'auth_users'

function generateUid(): string {
  return (
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
  )
}

function getAllUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(ALL_USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAllUsers(users: StoredUser[]): void {
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users))
}

function saveCurrentUser(u: LocalUser): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u))
}

function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}

function loadCurrentUser(): LocalUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function toLocalUser(s: StoredUser): LocalUser {
  return { uid: s.uid, email: s.email, displayName: s.displayName, photoURL: s.photoURL }
}

function deriveRole(u: LocalUser | null): 'admin' | 'user' | null {
  if (!u) return null
  return u.email?.toLowerCase().startsWith('admin') ? 'admin' : 'user'
}

// -------- Context --------

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<LocalUser | null>(null)
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const restored = loadCurrentUser()
      if (restored) {
        setUser(restored)
        setUserRole(deriveRole(restored))
      }
      setLoading(false)
    }, 150) // small delay to simulate async check

    return () => clearTimeout(timer)
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    const users = getAllUsers()
    if (users.some((u) => u.email === email)) {
      throw new Error('A user with this email already exists.')
    }

    const newUser: StoredUser = {
      uid: generateUid(),
      email,
      displayName: name,
      photoURL: null,
      password,
    }

    saveAllUsers([...users, newUser])
    const local = toLocalUser(newUser)
    saveCurrentUser(local)
    setUser(local)
    setUserRole(deriveRole(local))
  }

  const signIn = async (email: string, password: string) => {
    const users = getAllUsers()
    const match = users.find((u) => u.email === email && u.password === password)
    if (!match) {
      throw new Error('Invalid email or password.')
    }

    const local = toLocalUser(match)
    saveCurrentUser(local)
    setUser(local)
    setUserRole(deriveRole(local))
  }

  const signInWithGoogle = async () => {
    const googleUser: LocalUser = {
      uid: generateUid(),
      email: `googleuser_${Date.now()}@gmail.com`,
      displayName: 'Google User',
      photoURL: 'https://lh3.googleusercontent.com/a/default-user',
    }

    // Persist in the users array so they can sign in again
    const stored: StoredUser = { ...googleUser, password: '' }
    const users = getAllUsers()
    saveAllUsers([...users, stored])

    saveCurrentUser(googleUser)
    setUser(googleUser)
    setUserRole(deriveRole(googleUser))
  }

  const logout = async () => {
    clearCurrentUser()
    setUser(null)
    setUserRole(null)
  }

  const value: AuthContextType = {
    user,
    userRole,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
