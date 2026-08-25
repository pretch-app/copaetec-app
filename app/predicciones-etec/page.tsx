import { getCurrentUser } from "@/lib/auth"
import { getUpcomingMatchesForProde, getPredictionsByUser } from "@/lib/queries"
import { PageHeader } from "@/components/page-header"
import { PredictionCard } from "@/components/prode/prediction-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Target, Info } from "lucide-react"

export const metadata = {
  title: "Predicciones ETec | Copa ETec",
}

export default async function ProdePage() {
  const user = await getCurrentUser()
  const upcomingMatches = await getUpcomingMatchesForProde()
  
  let userPredictions: any[] = []
  if (user) {
    userPredictions = await getPredictionsByUser(user.id)
  }

  // Agrupar por fecha
  const matchesByMatchday = upcomingMatches.reduce((acc, match) => {
    const md = match.matchday || 0
    if (!acc[md]) acc[md] = []
    acc[md].push(match)
    return acc
  }, {} as Record<number, typeof upcomingMatches>)

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-500">
      <PageHeader
        title="Predicciones ETec Copa ETec"
        subtitle="Predecí los resultados de los próximos partidos y sumá puntos para el ranking global."
      />

      {!user ? (
        <div className="my-8 rounded-2xl border bg-primary/5 p-8 text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
            <Target className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">Iniciá sesión para empezar</h2>
          <p className="text-muted-foreground mb-6 text-balance">
            Tenés que estar registrado para poder guardar tus predicciones y competir en el ranking con el resto de la escuela.
          </p>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="default" size="lg" className="font-bold">Ingresar</Button>
            </Link>
            <Link href="/auth/registro">
              <Button variant="outline" size="lg">Crear Cuenta</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="my-8 text-center flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/predicciones-etec/ranking">
            <Button variant="outline" className="w-full sm:w-auto">Ver Ranking Global</Button>
          </Link>
          <Link href="/predicciones-etec/mis-predicciones">
            <Button variant="outline" className="w-full sm:w-auto">Mis Predicciones</Button>
          </Link>
        </div>
      )}

      {/* Reglas del Prode */}
      <div className="mb-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="rounded-full bg-primary/20 p-3 text-primary mt-1 shrink-0">
            <Info className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold mb-3">¿Cómo funciona el sistema de puntos?</h2>
            <ul className="space-y-4 text-muted-foreground text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-green-500/20 text-green-600 font-bold text-xs mt-0.5">5</span>
                <span><strong>Acierto Exacto:</strong> Acertás el resultado exacto del partido (ej. predecís 2-1 y termina 2-1). Sumás 5 puntos.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-yellow-500/20 text-yellow-600 font-bold text-xs mt-0.5">3</span>
                <span><strong>Acierto de Diferencia:</strong> Acertás la diferencia de goles y el ganador, pero no el resultado exacto (ej. predecís 2-0 y termina 3-1). Sumás 3 puntos.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-500/20 text-blue-600 font-bold text-xs mt-0.5">2</span>
                <span><strong>Acierto de Ganador/Empate:</strong> Acertás qué equipo gana o si el partido termina en empate, pero sin acertar la diferencia (ej. predecís 2-0 y termina 1-0). Sumás 2 puntos.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted/50 text-muted-foreground font-bold text-xs mt-0.5">0</span>
                <span><strong>Sin Acierto:</strong> No acertás ni el resultado ni el ganador (ej. predecís que gana el local y terminan empatando). No sumás puntos.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {Object.keys(matchesByMatchday).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No hay partidos próximos para predecir por el momento.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(matchesByMatchday).map(([matchday, matches]) => (
            <section key={matchday}>
              <h2 className="mb-6 font-display text-2xl font-bold flex items-center gap-2">
                <span className="bg-primary/20 text-primary h-8 w-8 rounded-lg flex items-center justify-center text-sm">
                  {matchday}
                </span>
                Fecha {matchday}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {matches.map((match: any) => {
                  const prediction = userPredictions.find(p => p.match_id === match.id)
                  return (
                    <PredictionCard 
                      key={match.id} 
                      match={match} 
                      prediction={prediction} 
                      disabled={!user}
                    />
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
