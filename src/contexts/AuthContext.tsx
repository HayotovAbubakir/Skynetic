import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '../services/supabase'

type AuthContextValue = {
  user: SupabaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setUser(null)
      } else {
        setUser(data.session?.user ?? null)
      }
      setLoading(false)
    }

    void initialize()

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    // Ensure any previous session is cleared before attempting login
    await supabase.auth.signOut()
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      // Pass error with status code for better handling in UI
      const authError = new Error(error.message)
      ;(authError as any).status = error.status
      ;(authError as any).type = 'auth_error'
      throw authError
    }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      // Pass error with status code for better handling in UI
      const authError = new Error(error.message)
      ;(authError as any).status = error.status
      ;(authError as any).type = 'signup_error'
      throw authError
    }
    
    // If signup was successful, check if email confirmation is required
    if (data.user) {
      // Email confirmation might be required - user will need to confirm before signing in
      // Don't attempt auto-signin as it may cause rate limiting
      // The user will receive a confirmation email and can sign in after confirming
      console.log('Account created. User may need to confirm email.')
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  }

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
