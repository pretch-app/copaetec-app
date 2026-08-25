"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { WifiOff } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const isConnectionError = /fetch failed|ECONNREFUSED|NetworkError/i.test(error.message)

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <WifiOff className="h-8 w-8" />
      </div>
      <h1 className="font-display text-2xl font-bold">
        {isConnectionError ? "No pudimos conectar con el servidor" : "Algo salió mal"}
      </h1>
      <p className="max-w-md text-sm text-muted-foreground text-balance">
        {isConnectionError
          ? "El backend no respondió. Si estás en desarrollo, verificá que esté corriendo (npm run dev en la carpeta backend)."
          : "Ocurrió un error inesperado al cargar esta página."}
      </p>
      <Button onClick={() => reset()} className="mt-2">
        Reintentar
      </Button>
    </div>
  )
}
