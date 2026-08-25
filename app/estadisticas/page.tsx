import Link from "next/link"
import { Target, Shield, Swords, Goal } from "lucide-react"
import { getTopScorers, getTournamentStats } from "@/lib/queries"
import { PageHeader } from "@/components/page-header"
import { TeamBadge } from "@/components/team-badge"
import { cn } from "@/lib/utils"



export default async function EstadisticasPage() {
  const [scorers, stats] = await Promise.all([getTopScorers(15), getTournamentStats()])
  
  // Find max goals for progress bar scaling
  const maxGoals = scorers.length > 0 ? Math.max(...scorers.map(s => s.goals)) : 0

  return (
    <>
      <PageHeader
        title="Estadísticas"
        subtitle="Los números del torneo: goleadores, mejor ataque, valla menos vencida y más."
        breadcrumbs={[{ label: "Estadísticas" }]}
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Highlight cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
            <HighlightCard
              icon={Swords}
              label="Mejor ataque"
              value={stats.bestAttack ? `${stats.bestAttack.goals_for}` : "-"}
              subvalue="goles a favor"
              team={stats.bestAttack?.name}
              slug={stats.bestAttack?.slug}
              gradient="from-blue-500/20 to-indigo-500/20"
              iconColor="text-blue-500"
            />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
            <HighlightCard
              icon={Shield}
              label="Mejor defensa"
              value={stats.bestDefense ? `${stats.bestDefense.goals_against}` : "-"}
              subvalue="goles en contra"
              team={stats.bestDefense?.name}
              slug={stats.bestDefense?.slug}
              gradient="from-emerald-500/20 to-teal-500/20"
              iconColor="text-emerald-500"
            />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
            <HighlightCard
              icon={Goal}
              label="Promedio de gol"
              value={String(stats.avgGoalsPerMatch)}
              subvalue="por partido"
              gradient="from-purple-500/20 to-pink-500/20"
              iconColor="text-purple-500"
            />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
            {stats.biggestWin ? (
              <HighlightCard
                icon={Target}
                label="Mayor goleada"
                value={`${stats.biggestWin.home_score} - ${stats.biggestWin.away_score}`}
                team={`${stats.biggestWin.home_name} vs ${stats.biggestWin.away_name}`}
                slug={stats.biggestWin.home_slug}
                gradient="from-orange-500/20 to-red-500/20"
                iconColor="text-orange-500"
              />
            ) : (
              <HighlightCard
                icon={Target}
                label="Mayor goleada"
                value="-"
                gradient="from-orange-500/20 to-red-500/20"
                iconColor="text-orange-500"
              />
            )}
          </div>
        </div>

        {/* Scorers */}
        <section className="animate-fade-up delay-400">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-8 w-2 rounded-full bg-primary" />
            <h2 className="font-display text-3xl font-bold tracking-tight">Tabla de goleadores</h2>
          </div>
          
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
            {scorers.length > 0 ? (
              <ol className="divide-y divide-border/50">
                {scorers.map((s, i) => {
                  const widthPercent = maxGoals > 0 ? (s.goals / maxGoals) * 100 : 0
                  
                  return (
                    <li
                      key={`${s.scorer_name}-${s.team_slug}`}
                      className="group relative flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 transition-colors hover:bg-secondary/40"
                    >
                      {/* Background progress bar */}
                      <div 
                        className="absolute inset-y-0 left-0 bg-primary/5 -z-10 transition-all duration-1000 ease-out" 
                        style={{ width: `${widthPercent}%` }}
                      />
                      
                      <div className="flex items-center gap-4 flex-1">
                        <span
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold shadow-sm transition-transform group-hover:scale-110",
                            i === 0 ? "bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-950" :
                            i === 1 ? "bg-gradient-to-br from-slate-300 to-slate-500 text-slate-950" :
                            i === 2 ? "bg-gradient-to-br from-orange-400 to-orange-700 text-orange-950" :
                            "bg-secondary text-secondary-foreground"
                          )}
                        >
                          {i + 1}
                        </span>
                        <Link href={`/equipos/${s.team_slug}`} className="flex min-w-0 flex-1 items-center gap-4 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
                          <TeamBadge name={s.team_name} photoUrl={s.escudo_url} size="md" className="shadow-sm" />
                          <div className="min-w-0">
                            <p className="truncate font-bold text-lg group-hover:text-primary transition-colors">{s.scorer_name}</p>
                            <p className="truncate text-sm text-muted-foreground font-medium">{s.team_name}</p>
                          </div>
                        </Link>
                      </div>
                      
                      <div className="flex items-center gap-4 pl-14 sm:pl-0">
                        {/* Visual bar for desktop */}
                        <div className="hidden sm:block w-32 h-2 rounded-full bg-secondary overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out delay-300"
                            style={{ width: `${widthPercent}%` }}
                          />
                        </div>
                        
                        <div className="flex flex-col items-end min-w-[3rem]">
                          <span className="font-display text-3xl font-bold tabular-nums text-primary group-hover:scale-110 transition-transform origin-right">
                            {s.goals}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            ) : (
              <div className="p-12 text-center">
                <Goal className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                <p className="font-medium text-muted-foreground">Aún no hay goles registrados en el torneo.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

function HighlightCard({
  icon: Icon,
  label,
  value,
  subvalue,
  team,
  slug,
  gradient,
  iconColor
}: {
  icon: any
  label: string
  value: string
  subvalue?: string
  team?: string
  slug?: string
  gradient: string
  iconColor: string
}) {
  const body = (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
      {/* Decorative gradient blob */}
      <div className={cn("absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150", gradient)} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
          <div className={cn("p-2 rounded-lg bg-background shadow-sm border border-border/50", iconColor)}>
            <Icon className="h-4 w-4" />
          </div>
          {label}
        </div>
        
        <div className="flex items-baseline gap-2">
          <p className="font-display text-5xl font-bold tracking-tight text-foreground">{value}</p>
          {subvalue && <span className="text-sm font-medium text-muted-foreground">{subvalue}</span>}
        </div>
        
        {team && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="truncate text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">{team}</p>
          </div>
        )}
      </div>
    </div>
  )
  
  if (slug && team) {
    return (
      <Link href={`/equipos/${slug}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
        {body}
      </Link>
    )
  }
  
  return body
}
