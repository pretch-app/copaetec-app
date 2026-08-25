import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Shirt, User, Trophy, CalendarDays, Activity } from "lucide-react"
import { getTeamBySlug, getPlayersByTeam, getMatchesByTeam, getStandings } from "@/lib/queries"
import { MatchCard } from "@/components/match-card"
import { TeamBadge } from "@/components/team-badge"
import { PageHeader } from "@/components/page-header"
import { cn } from "@/lib/utils"



export default async function TeamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const team = await getTeamBySlug(slug)
  if (!team) notFound()

  const [players, matches, standings] = await Promise.all([
    getPlayersByTeam(team.id),
    getMatchesByTeam(team.id),
    getStandings(),
  ])

  const standing = standings.find((s) => s.team_id === team.id)
  const position = standings.findIndex((s) => s.team_id === team.id) + 1
  
  // Custom header banner content
  const headerContent = (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-4">
      <div className="relative shrink-0 group">
        <TeamBadge name={team.name} photoUrl={team.escudo_url || team.photo_url} className="h-28 w-28 text-4xl shadow-xl ring-4 ring-background/20 group-hover:scale-105 transition-transform" />
      </div>
      <div className="text-center md:text-left">
        <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">{team.name}</h1>
        <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
          {team.grupo && (
            <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
              Grupo {team.grupo}
            </span>
          )}
          {team.captain && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/50 px-3 py-1 text-sm font-medium">
              <User className="h-3.5 w-3.5" /> Cap. {team.captain}
            </span>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader 
        title="" 
        subtitle={headerContent as any} // Using subtitle slot for custom content
        breadcrumbs={[{ label: "Equipos", href: "/equipos" }, { label: team.name }]}
      />

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Stats Strip */}
        {standing && (
          <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4 animate-fade-up">
            <MiniStat icon={Trophy} label="Posición" value={position > 0 ? `${position}°` : "-"} />
            <MiniStat icon={Activity} label="Puntos" value={standing.points} highlight />
            <MiniStat label="PJ / G / E / P" value={`${standing.played}/${standing.won}/${standing.drawn}/${standing.lost}`} small />
            <MiniStat label="Dif. de gol" value={standing.goal_diff > 0 ? `+${standing.goal_diff}` : standing.goal_diff} />
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Squad */}
          <section className="lg:col-span-5 animate-fade-up delay-100">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shirt className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Plantel</h2>
            </div>
            
            <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
              {players.length > 0 ? (
                <ul className="divide-y divide-border/50">
                  {players.map((p) => (
                    <li
                      key={p.id}
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
                        {p.number ?? <User className="h-4 w-4" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="block font-medium truncate">{p.name}</span>
                        {p.position && (
                          <span className="block text-xs text-muted-foreground mt-0.5">{p.position}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <User className="h-10 w-10 text-muted-foreground opacity-30 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">Plantel no cargado todavía.</p>
                </div>
              )}
            </div>
          </section>

          {/* Matches */}
          <section className="lg:col-span-7 animate-fade-up delay-200">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <CalendarDays className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Partidos</h2>
            </div>
            
            {matches.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {matches.map((m, i) => (
                  <div key={m.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Timeline dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-secondary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors group-hover:bg-primary group-hover:border-primary/20">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground group-hover:bg-primary-foreground" />
                    </div>
                    
                    {/* Card container */}
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)]">
                      <MatchCard match={m} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-surface-elevated/50 p-10 text-center">
                <CalendarDays className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium text-muted-foreground">
                  Sin partidos programados para este equipo.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function MiniStat({ label, value, small, icon: Icon, highlight }: { label: string; value: string | number; small?: boolean, icon?: any, highlight?: boolean }) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border bg-surface-elevated p-5 transition-transform hover:-translate-y-1",
      highlight ? "border-primary/30 shadow-md shadow-primary/5" : "border-border shadow-sm"
    )}>
      {highlight && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
      )}
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {Icon && <Icon className="h-3.5 w-3.5" />} {label}
      </div>
      <p className={cn("font-display font-bold tabular-nums text-foreground", small ? "text-xl" : "text-4xl")}>
        {value}
      </p>
    </div>
  )
}
