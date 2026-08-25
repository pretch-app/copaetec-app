"use client"

import { useActionState, useRef, useEffect } from "react"
import { submitPredictionAction } from "@/app/predicciones-etec/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Match, Prediction } from "@/lib/types"
import { useLiveMatch } from "@/hooks/use-live-match"
import { toast } from "sonner"

type PredictionCardProps = {
  match: Match
  prediction?: Prediction | null
  disabled?: boolean
}

export function PredictionCard({ match: initialMatch, prediction, disabled }: PredictionCardProps) {
  const match = useLiveMatch(initialMatch)
  const [state, formAction, isPending] = useActionState(submitPredictionAction, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  // Use useEffect to handle toasts on state change
  useEffect(() => {
    if (state?.success) {
      toast.success("Predicción guardada")
    }
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  const isClosed = disabled || match.status === "finished" || (match.kickoff && Date.now() >= new Date(match.kickoff).getTime())

  // Parse scores
  const predHome = prediction?.predicted_home ?? ""
  const predAway = prediction?.predicted_away ?? ""
  
  const isCurrentlyLive = match.status === "scheduled" && match.kickoff && Date.now() >= new Date(match.kickoff).getTime()

  return (
    <div className={`relative rounded-xl border p-4 transition-all duration-300 ${isClosed ? "bg-surface opacity-80" : "bg-surface-elevated hover:shadow-lg hover:border-primary/50"}`}>
      
      {isClosed && !isCurrentlyLive && (
        <div className="absolute top-2 right-2 text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-muted text-muted-foreground rounded-full">
          Cerrado
        </div>
      )}
      
      {isCurrentlyLive && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-destructive/10 text-destructive rounded-full animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
          En Vivo
        </div>
      )}

      {prediction && !isClosed && (
        <div className="absolute top-2 right-2 text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-primary/20 text-primary rounded-full">
          Guardado
        </div>
      )}

      <div className="text-center mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
          Fecha {match.matchday}
        </p>
        {match.kickoff && (
          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
            {new Date(match.kickoff).toLocaleString("es-AR", {
              weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
            })}
          </p>
        )}
      </div>

      <form ref={formRef} action={formAction} className="flex flex-col items-center gap-4">
        <input type="hidden" name="match_id" value={match.id} />
        
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex flex-col items-center flex-1">
            <div className="h-10 flex items-center justify-center mb-2 px-1">
              <span className="font-display font-bold text-sm text-center leading-tight line-clamp-2">{match.home_name}</span>
            </div>
            <Input 
              type="number" 
              name="predicted_home"
              defaultValue={predHome}
              min="0" max="99" 
              required
              disabled={Boolean(isClosed)}
              className="w-16 h-12 text-center text-xl font-bold rounded-lg border-2 focus-visible:ring-primary"
            />
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <span className="text-muted-foreground font-bold text-sm">VS</span>
          </div>

          <div className="flex flex-col items-center flex-1">
            <div className="h-10 flex items-center justify-center mb-2 px-1">
              <span className="font-display font-bold text-sm text-center leading-tight line-clamp-2">{match.away_name}</span>
            </div>
            <Input 
              type="number" 
              name="predicted_away"
              defaultValue={predAway}
              min="0" max="99" 
              required
              disabled={Boolean(isClosed)}
              className="w-16 h-12 text-center text-xl font-bold rounded-lg border-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        {isCurrentlyLive && (
          <div className="mt-2 text-center bg-primary/5 rounded-lg p-2 w-full border border-primary/20">
            <p className="text-xs text-primary font-bold uppercase mb-1">Resultado Parcial</p>
            <div className="flex items-center justify-center gap-2 font-display text-xl font-bold">
              <span>{match.home_score ?? 0}</span>
              <span className="text-muted-foreground text-sm">-</span>
              <span>{match.away_score ?? 0}</span>
            </div>
          </div>
        )}

        {state?.error && (
          <p className="text-xs text-destructive font-medium hidden">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-xs text-primary font-medium hidden">Predicción actualizada</p>
        )}

        {!isClosed && (
          <Button 
            type="submit" 
            variant="default" 
            size="sm" 
            className="w-full mt-2 font-semibold"
            disabled={isPending}
          >
            {isPending ? "Guardando..." : (prediction ? "Actualizar" : "Predecir")}
          </Button>
        )}
      </form>
    </div>
  )
}
