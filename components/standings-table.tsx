import Link from "next/link"
import type { StandingRow } from "@/lib/types"
import { TeamBadge } from "@/components/team-badge"
import { cn } from "@/lib/utils"
import { Info } from "lucide-react"

export function StandingsTable({
  rows,
  compact = false,
  highlightTop = 4,
}: {
  rows: StandingRow[]
  compact?: boolean
  highlightTop?: number
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-left text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-2 sm:px-4 py-3 sm:py-4 font-bold w-8 sm:w-12">#</th>
              <th className="px-2 sm:px-4 py-3 sm:py-4 font-bold min-w-[100px] sm:min-w-[140px]">Equipo</th>
              <th className="px-1 sm:px-3 py-3 sm:py-4 text-center font-bold">PJ</th>
              {!compact && (
                <>
                  <th className="px-1 sm:px-3 py-3 sm:py-4 text-center font-bold hidden sm:table-cell">G</th>
                  <th className="px-1 sm:px-3 py-3 sm:py-4 text-center font-bold hidden sm:table-cell">E</th>
                  <th className="px-1 sm:px-3 py-3 sm:py-4 text-center font-bold hidden sm:table-cell">P</th>
                  <th className="px-1 sm:px-3 py-3 sm:py-4 text-center font-bold hidden md:table-cell">GF</th>
                  <th className="px-1 sm:px-3 py-3 sm:py-4 text-center font-bold hidden md:table-cell">GC</th>
                </>
              )}
              <th className="px-1 sm:px-3 py-3 sm:py-4 text-center font-bold">DG</th>
              <th className="px-2 sm:px-4 py-3 sm:py-4 text-center font-bold text-foreground">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {rows.map((row, i) => {
              const isTop = i < highlightTop;
              const isMedalist = i < 3 && !compact;
              
              return (
                <tr 
                  key={row.team_id} 
                  className="group transition-colors hover:bg-secondary/40 animate-fade-up"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-2 sm:px-4 py-2 sm:py-3 relative">
                    {/* Qualification indicator line */}
                    {isTop && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-sm" />
                    )}
                    
                    <span
                      className={cn(
                        "flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md font-display text-[10px] sm:text-xs font-bold shadow-sm transition-transform group-hover:scale-110",
                        i === 0 ? "bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-950" :
                        i === 1 ? "bg-gradient-to-br from-slate-300 to-slate-500 text-slate-950" :
                        i === 2 ? "bg-gradient-to-br from-orange-400 to-orange-700 text-orange-950" :
                        isTop ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <Link
                      href={`/equipos/${row.slug}`}
                      className="flex items-center gap-2 sm:gap-3 font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                    >
                      <TeamBadge name={row.name} photoUrl={row.escudo_url} size="sm" className="shadow-sm transition-transform group-hover:scale-105 scale-75 sm:scale-100 origin-left" />
                      <span className="truncate text-xs sm:text-sm">{row.name}</span>
                    </Link>
                  </td>
                  <td className="px-1 sm:px-3 py-2 sm:py-3 text-center tabular-nums text-muted-foreground font-medium text-xs sm:text-sm">{row.played}</td>
                  {!compact && (
                    <>
                      <td className="px-1 sm:px-3 py-2 sm:py-3 text-center tabular-nums text-muted-foreground hidden sm:table-cell">{row.won}</td>
                      <td className="px-1 sm:px-3 py-2 sm:py-3 text-center tabular-nums text-muted-foreground hidden sm:table-cell">{row.drawn}</td>
                      <td className="px-1 sm:px-3 py-2 sm:py-3 text-center tabular-nums text-muted-foreground hidden sm:table-cell">{row.lost}</td>
                      <td className="px-1 sm:px-3 py-2 sm:py-3 text-center tabular-nums text-muted-foreground hidden md:table-cell">{row.goals_for}</td>
                      <td className="px-1 sm:px-3 py-2 sm:py-3 text-center tabular-nums text-muted-foreground hidden md:table-cell">{row.goals_against}</td>
                    </>
                  )}
                  <td className="px-1 sm:px-3 py-2 sm:py-3 text-center tabular-nums font-medium text-xs sm:text-sm">
                    <span className={cn(
                      row.goal_diff > 0 ? "text-success" : row.goal_diff < 0 ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {row.goal_diff > 0 ? `+${row.goal_diff}` : row.goal_diff}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center font-display text-base sm:text-lg font-bold tabular-nums text-primary">
                    {row.points}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {!compact && (
        <div className="bg-secondary/20 p-3 text-xs text-muted-foreground border-t border-border/50 flex flex-wrap gap-x-4 gap-y-1 justify-center sm:justify-start">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Zona de clasificación ({highlightTop})</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Info className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Desempate: Diferencia de gol, Goles a favor.</span>
          </div>
        </div>
      )}
    </div>
  )
}
