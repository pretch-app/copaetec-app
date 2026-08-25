import { getMatches } from "@/lib/queries"
import { MatchCard } from "@/components/match-card"
import { PageHeader } from "@/components/page-header"



export default async function FixturePage() {
  const matches = await getMatches()

  const groupMatches = matches.filter((m) => !m.stage || m.stage === "group")

  const byMatchday = groupMatches.reduce<Record<number, typeof matches>>((acc, m) => {
    acc[m.matchday] = acc[m.matchday] || []
    acc[m.matchday].push(m)
    return acc
  }, {})

  const matchdays = Object.keys(byMatchday)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <>
      <PageHeader
        title="Fixture"
        subtitle="Calendario completo del torneo, fecha por fecha. Tocá un partido finalizado para leer la crónica."
      />
      <div className="mx-auto max-w-6xl px-4 py-10">
        {matchdays.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Todavía no se cargó el fixture.
          </p>
        ) : (
          <div className="space-y-10">
            {matchdays.map((md) => (
              <section key={md}>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="font-display text-2xl font-bold tracking-tight">Fecha {md}</h2>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
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
