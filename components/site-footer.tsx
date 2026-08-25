import Link from "next/link"
import { Trophy, Mail } from "lucide-react"

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border bg-sidebar text-sidebar-foreground overflow-hidden">
      {/* Decorative gradient border top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
      
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand & Description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="group flex items-center gap-2 w-fit">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground transition-transform group-hover:rotate-6">
                <Trophy className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold tracking-wide">
                COPA ETEC <span className="text-accent">2026</span>
              </span>
            </Link>
            <p className="text-sm text-sidebar-foreground/70 max-w-xs text-pretty">
              Torneo intercolegial de fútbol 6. Toda la información, fixture, resultados y estadísticas en un solo lugar.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://www.instagram.com/promoetec26" target="_blank" rel="noopener noreferrer" className="text-sidebar-foreground/60 hover:text-accent transition-colors" aria-label="Instagram">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="mailto:admin@copaetec.com" className="text-sidebar-foreground/60 hover:text-accent transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-lg font-bold">Links Rápidos</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="/fixture" className="text-sidebar-foreground/70 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary/50" /> Fixture
                </Link>
              </li>
              <li>
                <Link href="/posiciones" className="text-sidebar-foreground/70 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary/50" /> Posiciones
                </Link>
              </li>
              <li>
                <Link href="/equipos" className="text-sidebar-foreground/70 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary/50" /> Equipos
                </Link>
              </li>
              <li>
                <Link href="/estadisticas" className="text-sidebar-foreground/70 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary/50" /> Estadísticas
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-lg font-bold">Información</h3>
            <p className="text-sm text-sidebar-foreground/70 text-pretty">
              Organizado por profesores de educacion fisica y alumnos de la escuela tecnica.
            </p>
            <Link
              href="/admin"
              className="mt-auto w-fit rounded-md border border-sidebar-border bg-sidebar-accent/50 px-4 py-2 text-xs font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              Panel de administración
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-sidebar-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sidebar-foreground/50">
          <p>© {currentYear} Copa ETec. Todos los derechos reservados.</p>
          <p>Desarrollado para el torneo escolar.</p>
        </div>
      </div>
    </footer>
  )
}
