import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  User as FirebaseUser,
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/services/firebase'
import { DEMO_USER } from '@/services/mockData'
import { UserProfile } from '@/types'

export interface AppUser {
  uid: string
  email: string | null
  displayName: string | null
  isDemo: boolean
}

interface AuthContextData {
  user: AppUser | null
  loading: boolean
  isDemoMode: boolean
  isFirebaseAvailable: boolean
  signIn: (email: string, pass: string) => Promise<void>
  signUp: (email: string, pass: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  enterDemoMode: () => void
  exitDemoMode: () => void
}

const AuthContext = createContext<AuthContextData | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    // If Firebase isn't configured, default to demo mode so user immediately has full working app
    if (!isFirebaseConfigured) return true
    const saved = localStorage.getItem('fintrack_auth_mode')
    return saved === 'demo'
  })

  useEffect(() => {
    // If in demo mode
    if (isDemoMode) {
      setUser({
        uid: DEMO_USER.uid,
        email: DEMO_USER.email,
        displayName: DEMO_USER.displayName,
        isDemo: true,
      })
      setLoading(false)
      return
    }

    // If Firebase is configured, listen to auth state changes
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Usuário FinTrack',
            isDemo: false,
          })
          setIsDemoMode(false)
        } else {
          // If no user and not explicitly set to demo, start in demo for best portfolio presentation, or keep null
          const savedMode = localStorage.getItem('fintrack_auth_mode')
          if (savedMode === 'demo' || !savedMode) {
            setIsDemoMode(true)
            setUser({
              uid: DEMO_USER.uid,
              email: DEMO_USER.email,
              displayName: DEMO_USER.displayName,
              isDemo: true,
            })
          } else {
            setUser(null)
          }
        }
        setLoading(false)
      })

      return () => unsubscribe()
    } else {
      // Firebase not configured, activate demo
      setIsDemoMode(true)
      setUser({
        uid: DEMO_USER.uid,
        email: DEMO_USER.email,
        displayName: DEMO_USER.displayName,
        isDemo: true,
      })
      setLoading(false)
    }
  }, [isDemoMode])

  const signIn = async (email: string, pass: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase não está configurado. Use o Modo de Demonstração ou adicione as chaves no arquivo .env')
    }
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass)
      localStorage.removeItem('fintrack_auth_mode')
      setIsDemoMode(false)
      setUser({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        isDemo: false,
      })
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, pass: string, name: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase não está configurado. Configure o arquivo .env para cadastrar novos usuários no Firestore.')
    }
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass)
      if (cred.user) {
        await updateFirebaseProfile(cred.user, { displayName: name })
      }
      localStorage.removeItem('fintrack_auth_mode')
      setIsDemoMode(false)
      setUser({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name,
        isDemo: false,
      })
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (isDemoMode) {
      localStorage.setItem('fintrack_auth_mode', 'signed_out')
      setIsDemoMode(false)
      setUser(null)
      return
    }

    if (auth) {
      await firebaseSignOut(auth)
    }
    localStorage.removeItem('fintrack_auth_mode')
    setUser(null)
  }

  const enterDemoMode = () => {
    localStorage.setItem('fintrack_auth_mode', 'demo')
    setIsDemoMode(true)
    setUser({
      uid: DEMO_USER.uid,
      email: DEMO_USER.email,
      displayName: DEMO_USER.displayName,
      isDemo: true,
    })
  }

  const exitDemoMode = () => {
    localStorage.setItem('fintrack_auth_mode', 'signed_out')
    setIsDemoMode(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode,
        isFirebaseAvailable: isFirebaseConfigured,
        signIn,
        signUp,
        signOut,
        enterDemoMode,
        exitDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
