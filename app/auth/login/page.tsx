"use client"

import { useActionState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { loginAction } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Mail, Lock, AlertCircle, ChevronDown } from "lucide-react"

function LoginContent() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined)
  const searchParams = useSearchParams()
  const errorParam = searchParams.get("error")

  let oauthErrorMessage = null
  if (errorParam === "DomainNotAllowed") {
    oauthErrorMessage = "Solo se permiten correos de la institución."
  } else if (errorParam) {
    oauthErrorMessage = "Error al iniciar sesión con Google. Intenta nuevamente."
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface-elevated p-8 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />
        
        <div className="mb-8 flex flex-col items-center text-center relative z-10">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Trophy className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Copa ETec</h1>
          <p className="mt-2 text-sm text-muted-foreground text-balance">
            Iniciá sesión para predecir los resultados.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {oauthErrorMessage && (
            <div className="flex items-center gap-2 text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{oauthErrorMessage}</p>
            </div>
          )}

          <a 
            href="/api/auth/google" 
            className="w-full h-12 font-bold text-base bg-white hover:bg-gray-100 text-black border border-gray-200 shadow-sm flex items-center justify-center gap-2 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            Continuar con Google
          </a>
          
          <p className="text-xs text-center text-muted-foreground mt-2">
            Solo se permiten correos de la institución.
          </p>

          <details className="mt-8 group">
            <summary className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer list-none">
              Acceso de Administrador <ChevronDown className="h-3 w-3 group-open:rotate-180 transition-transform" />
            </summary>
            
            <form action={formAction} className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10 h-10"
                      placeholder="Admin Email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="pl-10 h-10"
                      placeholder="Contraseña"
                    />
                  </div>
                </div>
              </div>
              
              {state?.error && (
                <p className="text-xs font-medium text-destructive text-center">
                  {state.error}
                </p>
              )}

              <Button type="submit" variant="secondary" className="w-full" disabled={isPending}>
                {isPending ? "Ingresando..." : "Entrar como Admin"}
              </Button>
            </form>
          </details>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Cargando...</div>}>
      <LoginContent />
    </Suspense>
  )
}
