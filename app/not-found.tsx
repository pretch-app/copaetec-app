import Link from "next/link"
import { Trophy, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        {/* Glow effect */}
        <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full" />
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-secondary text-primary shadow-xl">
          <Trophy className="h-16 w-16 opacity-50" />
          <div className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive text-destructive-foreground font-display font-bold text-xl shadow-lg animate-bounce">
            404
          </div>
        </div>
      </div>
      
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl mb-4">
        ¡Pelota afuera!
      </h1>
      <p className="text-lg text-muted-foreground max-w-md text-balance mb-8">
        La página que estás buscando no existe, fue movida o está fuera de los límites de la cancha.
      </p>
      
      <Link 
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
      >
        <Home className="h-5 w-5" /> Volver al inicio
      </Link>
    </div>
  )
}
