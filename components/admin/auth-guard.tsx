"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Don't protect the signin page
  const isSignInPage = pathname === "/admin/signin"

  useEffect(() => {
    if (isSignInPage) {
      setIsLoading(false)
      setIsAuthenticated(true)
      return
    }

    checkAuth()
  }, [pathname, isSignInPage])

  const checkAuth = async () => {
    try {
      const supabase = createSupabaseClient()

      // Get current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        console.log("No valid session found")
        router.push("/admin/signin")
        return
      }

      // Check admin privileges via API
      const response = await fetch("/api/admin/check-privileges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      })

      if (!response.ok) {
        console.error("Admin privilege check failed")
        router.push("/admin/signin")
        return
      }

      const { isAdmin } = await response.json()

      if (!isAdmin) {
        console.error("User is not an admin")
        router.push("/admin/signin")
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      console.error("Auth check error:", error)
      router.push("/admin/signin")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && !isSignInPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default AuthGuard
