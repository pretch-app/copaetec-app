"use client"

import { useState } from "react"
import Link from "next/link"
import { logoutAction } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { LogOut, User as UserIcon, Trophy, ChevronDown } from "lucide-react"

type UserMenuProps = {
  user: {
    display_name: string
    role: string
  } | null
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

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
              <Link href="/admin" onClick={() => setIsOpen(false)}>
                <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left hover:bg-primary/10 hover:text-primary transition-colors font-medium">
                  <UserIcon className="h-4 w-4" />
                  Panel Admin
                </button>
              </Link>
            )}

            <Link href="/perfil" onClick={() => setIsOpen(false)}>
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left hover:bg-muted transition-colors font-medium">
                <UserIcon className="h-4 w-4" />
                Mi Perfil
              </button>
            </Link>
            
            <Link href="/predicciones-etec/mis-predicciones" onClick={() => setIsOpen(false)}>
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left hover:bg-muted transition-colors font-medium">
                <Trophy className="h-4 w-4" />
                Mis Predicciones
              </button>
            </Link>
            
            <div className="my-1 h-px bg-border" />
            
            <form action={logoutAction}>
              <button type="submit" className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
