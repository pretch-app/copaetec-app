import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, CalendarDays, FileText } from "lucide-react"
import { getMatchById, getEventsByMatch } from "@/lib/queries"
import { TeamBadge } from "@/components/team-badge"
import { formatDate, formatTime } from "@/lib/format"
import { cn } from "@/lib/utils"



export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const matchId = Number(id)
  if (Number.isNaN(matchId)) notFound()

  const match = await getMatchById(matchId)
  if (!match) notFound()

  const events = await getEventsByMatch(matchId)
  const allGoals = events.filter(e => ['goal', 'penalty_goal', 'own_goal'].includes(e.event_type))
  
  const goalsGrouped = allGoals.reduce((acc, g) => {
    const key = `${g.team_id}-${g.player_name}`
    if (!acc[key]) acc[key] = { id: g.id, team_id: g.team_id, scorer_name: g.player_name, goals_count: 0 }
    acc[key].goals_count++
    return acc
  }, {} as Record<string, any>)
  
  const goals = Object.values(goalsGrouped)

  const homeGoals = goals.filter((g) => g.team_id === match.home_team_id)
  const awayGoals = goals.filter((g) => g.team_id === match.away_team_id)

  const finished = match.status === "finished"
  const homeWon = finished && (match.home_score ?? 0) > (match.away_score ?? 0)
  const awayWon = finished && (match.away_score ?? 0) > (match.home_score ?? 0)
  const draw = finished && match.home_score === match.away_score

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/resultados"
        className="group mb-8 inline-flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Volver a resultados
      </Link>

      {/* Broadcast Scoreboard */}
      <div className="overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-xl animate-fade-up">
        {/* Top Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 bg-secondary/30 px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-primary/10 px-2.5 py-1 font-bold text-primary">
              Fecha {match.matchday}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> {formatDate(match.kickoff)} {formatTime(match.kickoff)}
            </span>
          </div>
          {match.venue && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary/70" /> {match.venue}
            </span>
          )}
        </div>

        {/* Main Score Area */}
        <div className="relative overflow-hidden p-8 sm:p-12">
          {/* Subtle background glow based on winner */}
          {finished && !draw && (
            <div className={cn(
              "absolute inset-0 opacity-10 transition-colors duration-1000",
              homeWon ? "bg-gradient-to-r from-primary to-transparent" : "bg-gradient-to-l from-primary to-transparent"
            )} />
          )}

          <div className="relative grid grid-cols-3 items-center gap-4">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-4 text-center">
              <Link href={`/equipos/${match.home_slug}`} className="group outline-none">
                <TeamBadge name={match.home_name ?? ""} size="lg" className={cn("h-24 w-24 sm:h-32 sm:w-32 text-4xl shadow-xl transition-transform duration-300 group-hover:scale-105 group-focus-visible:ring-4 ring-primary ring-offset-4 ring-offset-surface-elevated", homeWon && "ring-4 ring-primary ring-offset-4")} />
              </Link>
              <h2 className={cn("font-display text-xl sm:text-2xl tracking-tight transition-colors", homeWon ? "font-bold text-primary" : "font-medium text-foreground")}>
                {match.home_name}
              </h2>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center justify-center">
              {finished ? (
                <div className="flex items-center justify-center gap-3 sm:gap-6 rounded-2xl bg-secondary/50 px-6 py-4 shadow-inner">
                  <span className={cn("font-display text-5xl sm:text-7xl font-bold tabular-nums tracking-tighter drop-shadow-md", homeWon ? "text-primary" : "text-foreground")}>
                    {match.home_score}
                  </span>
                  <span className="font-display text-3xl sm:text-4xl text-muted-foreground opacity-50">-</span>
                  <span className={cn("font-display text-5xl sm:text-7xl font-bold tabular-nums tracking-tighter drop-shadow-md", awayWon ? "text-primary" : "text-foreground")}>
                    {match.away_score}
                  </span>
                </div>
              ) : (
                <span className="rounded-2xl bg-secondary/50 px-6 py-3 font-display text-3xl font-bold text-muted-foreground shadow-inner">
                  VS
                </span>
              )}
              {finished && (
                <div className="mt-4 rounded-full bg-foreground px-4 py-1 text-xs font-bold uppercase tracking-widest text-background">
                  Finalizado
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-4 text-center">
              <Link href={`/equipos/${match.away_slug}`} className="group outline-none">
                <TeamBadge name={match.away_name ?? ""} size="lg" className={cn("h-24 w-24 sm:h-32 sm:w-32 text-4xl shadow-xl transition-transform duration-300 group-hover:scale-105 group-focus-visible:ring-4 ring-primary ring-offset-4 ring-offset-surface-elevated", awayWon && "ring-4 ring-primary ring-offset-4")} />
              </Link>
              <h2 className={cn("font-display text-xl sm:text-2xl tracking-tight transition-colors", awayWon ? "font-bold text-primary" : "font-medium text-foreground")}>
                {match.away_name}
              </h2>
            </div>
          </div>
        </div>

        {/* Goal Scorers */}
        {goals.length > 0 && (
          <div className="grid grid-cols-2 gap-8 border-t border-border/50 bg-secondary/10 px-8 py-6 text-sm">
            <div className="space-y-3">
              {homeGoals.map((g) => (
                <div key={g.id} className="flex items-center gap-2 text-foreground/90">
                  <span className="text-base">⚽</span>
                  <span className="font-medium">{g.scorer_name}</span>
                  {g.goals_count > 1 && <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs font-bold text-primary">×{g.goals_count}</span>}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {awayGoals.map((g) => (
                <div key={g.id} className="flex items-center justify-end gap-2 text-foreground/90">
                  {g.goals_count > 1 && <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs font-bold text-primary">×{g.goals_count}</span>}
                  <span className="font-medium">{g.scorer_name}</span>
                  <span className="text-base">⚽</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Match Report */}
      {match.report && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-sm animate-fade-up delay-100">
          <div className="flex items-center gap-3 border-b border-border/50 bg-secondary/30 px-8 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight">Crónica del partido</h2>
          </div>
          <div className="px-8 py-8">
            <p className="leading-relaxed text-foreground/90 text-pretty text-lg font-medium whitespace-pre-wrap">
              {match.report}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
