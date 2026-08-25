import { getFinishedMatches } from "@/lib/queries"
import { MatchCard } from "@/components/match-card"
import { PageHeader } from "@/components/page-header"
import { CalendarDays } from "lucide-react"



export default async function ResultadosPage() {
  const matches = await getFinishedMatches()

  const groupMatches = matches.filter((m) => !m.stage || m.stage === "group")

  const byMatchday = groupMatches.reduce<Record<number, typeof matches>>((acc, m) => {
    acc[m.matchday] = acc[m.matchday] || []
    acc[m.matchday].push(m)
    return acc
  }, {})

  const matchdays = Object.keys(byMatchday)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <>
      <PageHeader
        title="Resultados"
        subtitle="Todos los partidos finalizados con sus marcadores. Tocá un partido para ver la crónica y los goleadores."
        breadcrumbs={[{ label: "Resultados" }]}
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
        {matchdays.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-elevated/50 px-6 py-20 text-center animate-fade-up">
            <CalendarDays className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <p className="font-display text-xl font-bold">Sin resultados aún</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Cuando se jueguen los primeros partidos, aparecerán acá.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {matchdays.map((md, i) => (
              <section key={md} className="animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary font-bold shadow-sm">
                    <CalendarDays className="h-5 w-5" />
                    <span>Fecha {md}</span>
                  </div>
                  <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  {byMatchday[md].map((m) => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
