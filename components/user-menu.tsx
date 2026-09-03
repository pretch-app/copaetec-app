"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AUTH_STATE_CHANGED_EVENT, getMe, logout, type CurrentUser } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { LogOut, User as UserIcon, Trophy, ChevronDown } from "lucide-react"

export function UserMenu() {
  const [user, setUser] = useState<CurrentUser>(null)
  const [loaded, setLoaded] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    function updateUser() {
      getMe().then((u) => {
        setUser(u)
        setLoaded(true)
      })
    }

    updateUser()
    window.addEventListener(AUTH_STATE_CHANGED_EVENT, updateUser)

    return () => window.removeEventListener(AUTH_STATE_CHANGED_EVENT, updateUser)
  }, [])

  async function handleLogout() {
    await logout()
    setUser(null)
    setIsOpen(false)
    router.push("/")
    router.refresh()
  }

  if (!loaded) return <div className="h-8 w-8" />

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button size="sm">Ingresar</Button>
        </Link>
      </div>
    )
  }

  const initial = user.display_name.charAt(0).toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-border bg-surface pl-2 pr-4 py-1 hover:bg-surface-elevated transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
          {initial}
        </div>
        <span className="text-sm font-medium hidden sm:inline-block max-w-[100px] truncate">
          {user.display_name}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-background p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 text-foreground">

            {user.role === "admin" && (
              <Link href="/admin" onClick={() => setIsOpen(false)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left hover:bg-primary/10 hover:text-primary transition-colors font-medium">
                <UserIcon className="h-4 w-4" />
                Panel Admin
              </Link>
            )}

            <Link href="/perfil" onClick={() => setIsOpen(false)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left hover:bg-muted transition-colors font-medium">
                <UserIcon className="h-4 w-4" />
                Mi Perfil
            </Link>

            <Link href="/predicciones-etec/mis-predicciones" onClick={() => setIsOpen(false)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left hover:bg-muted transition-colors font-medium">
                <Trophy className="h-4 w-4" />
                Mis Predicciones
            </Link>

            <div className="my-1 h-px bg-border" />

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </>
      )}
    </div>
  )
}
