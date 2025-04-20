"use client"

import { createContext, useContext, type ReactNode } from "react"

// Empty context - we're not implementing actual auth
const AuthContext = createContext({})

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}

