"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getMe, apiClient, type CurrentUser } from "@/lib/api-client"
import type { Prediction, Match } from "@/lib/types"
import { PageHeader } from "@/components/page-header"
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"

type PredictionRow = Prediction & {
  matchday: number
  kickoff: string | null
  match_status: Match["status"]
  home_score: number | null
  away_score: number | null
  stage: string
  home_name: string
  home_slug: string
  home_escudo_url: string | null
  away_name: string
  away_slug: string
  away_escudo_url: string | null
}

export default function MisPrediccionesPage() {
  const router = useRouter()
  const [user, setUser] = useState<CurrentUser>(null)
  const [predictions, setPredictions] = useState<PredictionRow[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      const me = await getMe()
      if (!me) {
        router.push("/auth/login")
        return
      }
      setUser(me)
      const result = await apiClient<PredictionRow[]>("/api/predictions/me")
      if (result.ok) setPredictions(result.data)
      setLoaded(true)
    }
    load()
  }, [router])

  if (!loaded || !user) {
    return (
      <div className="container py-8 md:py-12">
        <PageHeader title="Mis Predicciones" subtitle="Historial de todos los partidos que predijiste." />
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12 animate-in fade-in duration-500">
      <PageHeader
        title="Mis Predicciones"
        subtitle="Historial de todos los partidos que predijiste."
      />

      <div className="max-w-4xl mx-auto mt-8 space-y-4">
        {predictions.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-surface-elevated">
            <p className="text-muted-foreground">Aún no realizaste ninguna predicción.</p>
          </div>
        ) : (
          predictions.map((pred) => {
            const isFinished = pred.match_status === "finished" && pred.points_awarded !== null

            let statusColor = "bg-muted text-muted-foreground"
            let StatusIcon = Clock
            let statusText = "Pendiente"

            if (isFinished) {
              if (pred.points_awarded === 5) {
                statusColor = "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                StatusIcon = CheckCircle2
                statusText = "+5 pts (Pleno)"
              } else if (pred.points_awarded === 3) {
                statusColor = "bg-blue-500/20 text-blue-500 border-blue-500/30"
                StatusIcon = CheckCircle2
                statusText = "+3 pts (Diferencia)"
              } else if (pred.points_awarded === 2) {
                statusColor = "bg-amber-500/20 text-amber-500 border-amber-500/30"
                StatusIcon = AlertCircle
                statusText = "+2 pts (Ganador)"
              } else {
                statusColor = "bg-destructive/20 text-destructive border-destructive/30"
                StatusIcon = XCircle
                statusText = "0 pts (Falló)"
              }
            }

            return (
              <div key={pred.id} className={`flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border ${isFinished ? 'bg-surface' : 'bg-surface-elevated'} shadow-sm gap-4`}>

                <div className="flex-1 text-center md:text-left">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                    Fecha {pred.matchday} • {pred.stage === 'group' ? 'Fase de Grupos' : 'Eliminatoria'}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className="font-display font-bold w-24 md:w-32 truncate text-right">{pred.home_name}</span>
                    <span className="text-muted-foreground text-sm">vs</span>
                    <span className="font-display font-bold w-24 md:w-32 truncate text-left">{pred.away_name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Tu Predicción</p>
                    <p className="font-display text-xl font-bold bg-secondary/50 px-3 py-1 rounded-md">
                      {pred.predicted_home} - {pred.predicted_away}
                    </p>
                  </div>

                  {isFinished && (
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Resultado Real</p>
                      <p className="font-display text-xl font-bold px-3 py-1">
                        {pred.home_score} - {pred.away_score}
                      </p>
                    </div>
                  )}
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusColor} min-w-[140px] justify-center`}>
                  <StatusIcon className="h-4 w-4" />
                  <span className="font-bold text-sm">{statusText}</span>
                </div>

              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
