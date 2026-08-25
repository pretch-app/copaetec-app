"use client"

import Link from "next/link"
import { MapPin, CalendarDays, Clock, PlayCircle } from "lucide-react"
import type { Match } from "@/lib/types"
import { formatDate, formatTime } from "@/lib/format"
import { TeamBadge } from "@/components/team-badge"
import { cn } from "@/lib/utils"
import { useLiveMatch } from "@/hooks/use-live-match"

export function MatchCard({ match: initialMatch }: { match: Match }) {
  const match = useLiveMatch(initialMatch)
  
  const finished = match.status === "finished"
  const homeWon = finished && (match.home_score ?? 0) > (match.away_score ?? 0)
  const awayWon = finished && (match.away_score ?? 0) > (match.home_score ?? 0)
  const draw = finished && match.home_score === match.away_score
  
  const isLive = match.status === "scheduled" && match.kickoff && Date.now() >= new Date(match.kickoff).getTime()

  const content = (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border bg-surface-elevated p-5 transition-all duration-300 hover:shadow-md",
      finished ? "border-border" : "border-primary/20 bg-background",
      isLive && "border-destructive animate-pulse-glow"
    )}>
      {/* Decorative background for scheduled matches */}
      {!finished && !isLive && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
      )}
      
      {/* Live Badge */}
      {isLive && (
        <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg shadow-sm">
          En Vivo
        </div>
      )}

      {/* Header: Matchday and Time */}
      <div className="relative mb-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          finished ? "bg-secondary text-secondary-foreground" : "bg-primary/10 text-primary font-bold shadow-sm"
        )}>
          Fecha {match.matchday}
        </span>
        <div className="flex items-center gap-2">
          {match.kickoff && (
            <>
              <span className="flex items-center gap-1" suppressHydrationWarning>
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(match.kickoff).split(',')[0]}
              </span>
              <span className="flex items-center gap-1" suppressHydrationWarning>
                <Clock className="h-3.5 w-3.5" />
                {formatTime(match.kickoff)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Teams and Score */}
      <div className="relative flex items-center gap-4">
        {/* Home Team */}
        <div className={cn("flex flex-1 flex-col items-center gap-2 text-center", awayWon && "opacity-60")}>
          <TeamBadge name={match.home_name ?? ""} photoUrl={match.home_escudo_url} size="lg" className={cn(homeWon && "ring-2 ring-primary ring-offset-2 ring-offset-surface-elevated")} />
          <span className={cn("line-clamp-2 text-sm leading-tight transition-colors group-hover:text-primary", homeWon ? "font-bold" : "font-medium")}>
            {match.home_name}
          </span>
        </div>

        {/* Score / VS */}
        <div className="flex flex-col items-center justify-center min-w-[80px]">
          {finished || isLive ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 font-display text-4xl font-bold tabular-nums tracking-tighter">
                <span className={cn(homeWon || isLive ? "text-primary drop-shadow-sm" : draw ? "text-foreground" : "text-muted-foreground")}>{match.home_score ?? 0}</span>
                <span className="text-muted-foreground text-2xl font-light">-</span>
                <span className={cn(awayWon || isLive ? "text-primary drop-shadow-sm" : draw ? "text-foreground" : "text-muted-foreground")}>{match.away_score ?? 0}</span>
              </div>
              {match.home_penalties != null && match.away_penalties != null && (
                <div className="text-xs font-bold text-muted-foreground mt-0.5 tracking-wider">
                  ({match.home_penalties} - {match.away_penalties})
                </div>
              )}
            </div>
          ) : (
            <span className="rounded-full bg-secondary/50 px-3 py-1 font-display text-sm font-bold text-muted-foreground">
              VS
            </span>
          )}
        </div>

        {/* Away Team */}
        <div className={cn("flex flex-1 flex-col items-center gap-2 text-center", homeWon && "opacity-60")}>
          <TeamBadge name={match.away_name ?? ""} photoUrl={match.away_escudo_url} size="lg" className={cn(awayWon && "ring-2 ring-primary ring-offset-2 ring-offset-surface-elevated")} />
          <span className={cn("line-clamp-2 text-sm leading-tight transition-colors group-hover:text-primary", awayWon ? "font-bold" : "font-medium")}>
            {match.away_name}
          </span>
        </div>
      </div>

      {/* Footer: Venue and Action */}
      <div className="relative mt-5 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium">
          {match.venue ? (
            <>
              <MapPin className="h-3.5 w-3.5 text-primary/70" />
              {match.venue}
            </>
          ) : (
            "Sede a definir"
          )}
        </span>
        {finished && (
          <span className="flex items-center gap-1 font-bold text-primary transition-transform group-hover:translate-x-1">
            <PlayCircle className="h-4 w-4" /> Resumen
          </span>
        )}
      </div>
    </div>
  )

  if (finished) {
    return (
      <Link href={`/resultados/${match.id}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
        {content}
      </Link>
    )
  }
  return content
}
