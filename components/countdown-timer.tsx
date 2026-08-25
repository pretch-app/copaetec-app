"use client"

import { useState, useEffect } from "react"

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const TARGET_DATE = new Date("2026-08-14T13:00:00-03:00").getTime()

function calculateTimeLeft(): TimeLeft {
  const now = Date.now()
  const diff = Math.max(0, TARGET_DATE - now)

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0")

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative group">
        {/* Glow effect behind */}
        <div className="absolute -inset-1 bg-gradient-to-b from-primary/30 to-accent/30 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex gap-1">
          {display.split("").map((digit, i) => (
            <div
              key={i}
              className="relative w-8 h-12 sm:w-12 sm:h-16 md:w-16 md:h-24 rounded-xl overflow-hidden"
            >
              {/* Card background with subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-surface-elevated/90 to-surface-elevated/70 backdrop-blur-xl border border-border/50 rounded-xl" />
              
              {/* Center line */}
              <div className="absolute left-0 right-0 top-1/2 h-px bg-border/30 z-10" />
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl" />
              
              {/* Digit */}
              <span className="absolute inset-0 flex items-center justify-center font-display text-2xl sm:text-4xl md:text-5xl font-bold text-foreground tabular-nums">
                {digit}
              </span>
            </div>
          ))}
        </div>
      </div>
      <span className="text-[9px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const isEventStarted = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-2 sm:gap-5 md:gap-6 py-4">
        {["Días", "Horas", "Min", "Seg"].map((label) => (
          <CountdownUnit key={label} value={0} label={label} />
        ))}
      </div>
    )
  }

  if (isEventStarted) {
    return (
      <div className="relative py-4">
        <div className="flex items-center justify-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>
          <span className="text-xl sm:text-2xl font-display font-bold text-gradient-gold uppercase tracking-wider">
            ¡El torneo ha comenzado!
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4">
      <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-5">
        El torneo comienza en
      </p>
      <div className="flex items-center justify-center gap-1 sm:gap-4 md:gap-6">
        <CountdownUnit value={timeLeft.days} label="Días" />
        <span className="text-lg sm:text-2xl md:text-3xl font-bold text-primary/60 animate-pulse self-start mt-3 sm:mt-4 md:mt-6">:</span>
        <CountdownUnit value={timeLeft.hours} label="Horas" />
        <span className="text-lg sm:text-2xl md:text-3xl font-bold text-primary/60 animate-pulse self-start mt-3 sm:mt-4 md:mt-6">:</span>
        <CountdownUnit value={timeLeft.minutes} label="Min" />
        <span className="text-lg sm:text-2xl md:text-3xl font-bold text-primary/60 animate-pulse self-start mt-3 sm:mt-4 md:mt-6">:</span>
        <CountdownUnit value={timeLeft.seconds} label="Seg" />
      </div>
    </div>
  )
}
