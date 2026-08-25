"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme") as "dark" | "light" | null
    const initial = stored || "dark"
    setTheme(initial)
    document.documentElement.classList.toggle("dark", initial === "dark")
    document.documentElement.classList.toggle("light", initial === "light")
  }, [])

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem("theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
    document.documentElement.classList.toggle("light", next === "light")
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-surface-elevated/50 backdrop-blur-sm transition-all duration-300 hover:bg-surface-elevated hover:border-primary/30 hover:shadow-[0_0_15px_oklch(var(--primary)/20%)]"
        aria-label="Cambiar tema"
      >
        <Moon className="h-4 w-4" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-surface-elevated/50 backdrop-blur-sm transition-all duration-300 hover:bg-surface-elevated hover:border-primary/30 hover:shadow-[0_0_15px_oklch(var(--primary)/20%)] cursor-pointer group"
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <div className="relative w-4 h-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 text-amber-400 transition-all duration-500 ${
            theme === "light"
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 text-blue-300 transition-all duration-500 ${
            theme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </button>
  )
}
