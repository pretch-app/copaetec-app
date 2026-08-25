import { getMatches } from "@/lib/queries"
import { MatchCard } from "@/components/match-card"
import { PageHeader } from "@/components/page-header"
import { Trophy, GitMerge } from "lucide-react"



const STAGE_LABELS: Record<string, string> = {
  final: "Final",
  semi_finals: "Semifinales",
  quarter_finals: "Cuartos de Final",
  round_of_16: "Octavos de Final",
}

const STAGE_ORDER = ["round_of_16", "quarter_finals", "semi_finals", "final"]

export default async function LlavesPage() {
  const matches = await getMatches()

  // Filter knockout matches
  const knockouts = matches.filter((m) => m.stage && m.stage !== "group")

  const byStage = knockouts.reduce<Record<string, typeof matches>>((acc, m) => {
    acc[m.stage] = acc[m.stage] || []
    acc[m.stage].push(m)
    return acc
  }, {})

  const availableStages = STAGE_ORDER.filter((s) => byStage[s] && byStage[s].length > 0)
  
  // Find the champion if final is finished
  const finalMatch = byStage["final"]?.[0]
  let champion = null
  if (finalMatch && finalMatch.status === "finished") {
    if ((finalMatch.home_score ?? 0) > (finalMatch.away_score ?? 0)) {
      champion = finalMatch.home_name
    } else if ((finalMatch.away_score ?? 0) > (finalMatch.home_score ?? 0)) {
      champion = finalMatch.away_name
    }
  }

  return (
    <>
      <PageHeader
        title="Llaves"
        subtitle="Cuadro eliminatorio del torneo. Sigue el camino hacia la gran final."
        breadcrumbs={[{ label: "Llaves" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-16">
        {champion && (
          <div className="mb-16 flex flex-col items-center justify-center animate-fade-up">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-950 shadow-xl ring-8 ring-yellow-500/20 animate-bounce">
                <Trophy className="h-12 w-12" />
              </div>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">¡Tenemos Campeón!</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gradient-gold drop-shadow-sm text-center">
              {champion}
            </h2>
          </div>
        )}

        {availableStages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-elevated/50 px-6 py-20 text-center animate-fade-up">
            <GitMerge className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <p className="font-display text-xl font-bold">Sin eliminatorias todavía</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Las llaves se generarán automáticamente una vez que finalice la fase de grupos.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-12 hide-scrollbar">
            <div className="flex gap-12 min-w-max px-4">
              {availableStages.map((stage, stageIndex) => (
                <div key={stage} className="flex flex-col gap-6 w-[340px] shrink-0">
                  <div className="rounded-xl border border-border/50 bg-secondary/80 backdrop-blur-sm px-4 py-3 text-center shadow-sm">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {STAGE_LABELS[stage] || stage}
                    </h3>
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-around gap-8 relative">
                    {byStage[stage].map((m, matchIndex) => (
                      <div key={m.id} className="relative group animate-fade-up" style={{ animationDelay: `${(stageIndex * 100) + (matchIndex * 50)}ms` }}>
                        <MatchCard match={m} />
                        
                        {/* Bracket Connector Line to the right (except for final) */}
                        {stage !== "final" && (
                          <div className="hidden lg:block absolute top-1/2 -right-12 w-12 h-px bg-border group-hover:bg-primary transition-colors z-[-1]" />
                        )}
                        
                        {/* Vertical connectors for even/odd matches combining into the next stage */}
                        {stage !== "final" && matchIndex % 2 === 0 && (
                          <div className="hidden lg:block absolute top-1/2 -right-12 w-px h-[calc(100%+2rem)] bg-border group-hover:bg-primary transition-colors z-[-1]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
