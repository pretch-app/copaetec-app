"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X, Trophy, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserMenu } from "./user-menu"
import { ThemeToggle } from "./theme-toggle"

const tournamentLinks = [
  { href: "/fixture", label: "Fixture" },
  { href: "/resultados", label: "Resultados" },
  { href: "/posiciones", label: "Posiciones" },
  { href: "/llaves", label: "Llaves" },
  { href: "/estadisticas", label: "Estadísticas" },
  { href: "/equipos", label: "Equipos" },
]

export function SiteHeader({ user }: { user: { display_name: string; role: string } | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [torneoOpen, setTorneoOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300 border-b",
        scrolled 
          ? "glass border-border/50 text-foreground shadow-sm" 
          : "bg-sidebar border-sidebar-border text-sidebar-foreground"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 shadow-sm">
            <Trophy className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-wide">
            COPA ETEC <span className="text-accent group-hover:text-primary transition-colors">2026</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex">
          <Link
            href="/"
            className={cn(
              "relative px-2 py-2 text-sm font-medium transition-colors",
              pathname === "/" ? "text-primary font-bold" : "text-current opacity-70 hover:opacity-100 hover:text-primary"
            )}
          >
            Inicio
          </Link>
          <Link
            href="/predicciones-etec"
            className={cn(
              "relative px-2 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/predicciones-etec") ? "text-primary font-bold" : "text-current opacity-70 hover:opacity-100 hover:text-primary"
            )}
          >
            Predicciones ETec
          </Link>
          <Link
            href="/noticias"
            className={cn(
              "relative px-2 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/noticias") ? "text-primary font-bold" : "text-current opacity-70 hover:opacity-100 hover:text-primary"
            )}
          >
            Noticias
          </Link>

          <div className="group relative">
            <button className={cn(
              "flex items-center gap-1 px-2 py-2 text-sm font-medium transition-colors cursor-pointer",
              tournamentLinks.some(l => pathname.startsWith(l.href)) ? "text-primary font-bold" : "text-current opacity-70 hover:opacity-100 hover:text-primary"
            )}>
              Torneo <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 rounded-md border border-border bg-popover text-popover-foreground shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="flex flex-col p-2">
                {tournamentLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname.startsWith(link.href) && "bg-accent/50 text-accent-foreground font-semibold"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/galeria"
            className={cn(
              "relative px-2 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/galeria") ? "text-primary font-bold" : "text-current opacity-70 hover:opacity-100 hover:text-primary"
            )}
          >
            Galería
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu user={user} />
          <button
            type="button"
            className="rounded-md p-2 hover:bg-foreground/10 lg:hidden transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "grid transition-all duration-300 ease-in-out lg:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <nav className={cn(
            "border-t border-border px-4 pb-4 pt-2",
            scrolled ? "glass" : "bg-sidebar"
          )}>
            <ul className="flex flex-col gap-1">
              <li>
                <Link href="/" onClick={() => setOpen(false)} className={cn("block rounded-md px-3 py-2 text-sm font-medium", pathname === "/" ? "bg-primary/10 text-primary font-bold" : "opacity-80")}>Inicio</Link>
              </li>
              <li>
                <Link href="/predicciones-etec" onClick={() => setOpen(false)} className={cn("block rounded-md px-3 py-2 text-sm font-medium", pathname.startsWith("/predicciones-etec") ? "bg-primary/10 text-primary font-bold" : "opacity-80")}>Predicciones ETec</Link>
              </li>
              <li>
                <Link href="/noticias" onClick={() => setOpen(false)} className={cn("block rounded-md px-3 py-2 text-sm font-medium", pathname.startsWith("/noticias") ? "bg-primary/10 text-primary font-bold" : "opacity-80")}>Noticias</Link>
              </li>
              <li>
                <button onClick={() => setTorneoOpen(!torneoOpen)} className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium opacity-80">
                  Torneo <ChevronDown className={cn("h-4 w-4 transition-transform", torneoOpen && "rotate-180")} />
                </button>
                {torneoOpen && (
                  <ul className="ml-4 flex flex-col gap-1 border-l-2 border-border pl-2 mt-1">
                    {tournamentLinks.map(link => (
                      <li key={link.href}>
                        <Link href={link.href} onClick={() => setOpen(false)} className={cn("block rounded-md px-3 py-2 text-sm", pathname.startsWith(link.href) ? "text-primary font-bold" : "opacity-80")}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <Link href="/galeria" onClick={() => setOpen(false)} className={cn("block rounded-md px-3 py-2 text-sm font-medium", pathname.startsWith("/galeria") ? "bg-primary/10 text-primary font-bold" : "opacity-80")}>Galería</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
