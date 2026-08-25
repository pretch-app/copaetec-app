"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import type { Team, Player, Match, MatchEvent } from "@/lib/types"
import {
  updateMatchResultAction,
  updateMatchExtrasAction,
  deleteMatchAction,
  addMatchEventAction,
  deleteMatchEventAction,
} from "@/app/admin/actions"

function teamName(teams: Team[], id: number) {
  return teams.find((t) => t.id === id)?.name ?? "?"
}

function wrapAction(action: Function, successMessage: string) {
  return async (formData: FormData) => {
    try {
      const result = await action(formData)
      if (result?.error) {
        toast.error(result.error)
      } else if (result?.success || result === undefined) {
        toast.success(successMessage)
      }
    } catch (e: any) {
      toast.error(e.message || "Ocurrió un error")
    }
  }
}

export function MatchEditorCard({ 
  match: m, 
  teams, 
  players, 
  events 
}: { 
  match: Match
  teams: Team[]
  players: Player[]
  events: MatchEvent[]
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const matchGoals = events.filter((g) => g.match_id === m.id)

  return (
    <Card className="overflow-hidden mb-4">
      <CardHeader 
        className="cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors py-4 px-6" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between gap-2 text-base m-0 font-medium">
          <div className="flex items-center gap-4">
             <span className="w-12 text-center bg-primary/10 text-primary rounded-md text-xs font-bold py-1">
               {m.stage === "group" || !m.stage ? `F${m.matchday}` : (m.stage === "round_of_16" ? "Oct" : m.stage === "quarter_finals" ? "Cua" : m.stage === "semi_finals" ? "Sem" : "Fin")}
             </span>
             <span>
               <span className="font-semibold">{teamName(teams, m.home_team_id)}</span>
               <span className="inline-block px-3 font-black text-lg tabular-nums">
                 {m.home_score ?? '-'} : {m.away_score ?? '-'}
               </span>
               <span className="font-semibold">{teamName(teams, m.away_team_id)}</span>
             </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${m.status === 'finished' ? 'bg-secondary text-secondary-foreground' : 'bg-green-100 text-green-800'}`}>
              {m.status === 'finished' ? 'Finalizado' : 'Pendiente'}
            </span>
            <div className="text-muted-foreground p-1 hover:bg-muted rounded-full">
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="flex flex-col gap-6 border-t pt-6 bg-background">
          <div className="flex justify-end">
             <form action={wrapAction(deleteMatchAction, "Partido eliminado")} onSubmit={(e) => { if (!confirm("¿Eliminar este partido?")) e.preventDefault() }}>
               <input type="hidden" name="id" value={m.id} />
               <Button variant="destructive" size="sm" type="submit">
                 Eliminar Partido
               </Button>
             </form>
          </div>
          
          <form action={wrapAction(updateMatchResultAction, "Resultado actualizado")} className="grid gap-4 sm:grid-cols-2 rounded-md border border-border p-4 bg-muted/20">
            <input type="hidden" name="id" value={m.id} />
            
            <div className="flex flex-col gap-1 sm:col-span-2">
              <p className="text-sm font-semibold mb-2 text-primary">Información del Partido</p>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Fase/Día</Label>
              <Input key={`matchday-${m.matchday}`} name="matchday" type="number" min="1" defaultValue={m.matchday?.toString() ?? "1"} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Horario</Label>
              <Input 
                key={`kickoff-${m.kickoff}`}
                name="kickoff" 
                type="datetime-local" 
                defaultValue={m.kickoff ? new Date(new Date(m.kickoff).getTime() - 3 * 60 * 60000).toISOString().slice(0,16) : ""} 
              />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <Label>Lugar</Label>
              <Input name="venue" defaultValue={m.venue ?? ""} placeholder="Estadio Central" />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2 mt-2">
              <p className="text-sm font-semibold mb-2 text-primary">Estado y Resultado</p>
              <p className="text-xs text-muted-foreground mb-2">El resultado se calcula automáticamente al agregar goles abajo. Cambia el estado a Finalizado para repartir los puntos de Predicciones ETec.</p>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Estado</Label>
              <select key={`status-${m.status}`} name="status" defaultValue={m.status ?? "scheduled"} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                <option value="scheduled">Pendiente</option>
                <option value="finished">Finalizado</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Resultado Actual</Label>
              <div className="h-9 flex items-center px-3 border border-border rounded-md bg-muted/50 font-bold font-display">
                {teamName(teams, m.home_team_id)} {m.home_score ?? 0} - {m.away_score ?? 0} {teamName(teams, m.away_team_id)}
              </div>
            </div>
            
            <div className="flex flex-col gap-1 sm:col-span-2 mt-2">
              <Label>Crónica del partido</Label>
              <Textarea name="report" defaultValue={m.report ?? ""} rows={2} placeholder="Opcional: Resumen de lo ocurrido" />
            </div>
            
            <div className="sm:col-span-2 mt-2">
              <Button type="submit" className="w-full">Guardar Cambios del Partido</Button>
            </div>
          </form>

          <div className="rounded-md border border-border p-3 flex flex-col gap-4">
            {/* Extras */}
            <form action={wrapAction(updateMatchExtrasAction, "Detalles actualizados")} className="flex flex-col gap-2 p-2 bg-muted/30 rounded border border-border">
              <input type="hidden" name="id" value={m.id} />
              <p className="text-sm font-semibold mb-1">Extras (Penales y Tiempo Extra)</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="flex items-center space-x-2 sm:col-span-2">
                  <input type="checkbox" id={`xtra-${m.id}`} name="is_extra_time" defaultChecked={m.is_extra_time} className="h-4 w-4 rounded border-gray-300" />
                  <label htmlFor={`xtra-${m.id}`} className="text-sm font-medium">Hubo Tiempo Extra</label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col">
                  <Label className="text-xs">Penales Local</Label>
                  <Input type="number" name="home_penalties" defaultValue={m.home_penalties ?? ""} placeholder="Ej: 4" className="h-8" />
                </div>
                <div className="flex flex-col">
                  <Label className="text-xs">Penales Visitante</Label>
                  <Input type="number" name="away_penalties" defaultValue={m.away_penalties ?? ""} placeholder="Ej: 3" className="h-8" />
                </div>
              </div>
              <Button type="submit" size="sm" variant="secondary" className="mt-1">Guardar Extras</Button>
            </form>

            <div>
              <p className="mb-2 text-sm font-semibold">Eventos del Partido</p>
              <ul className="mb-3 flex flex-col gap-1">
                {matchGoals.map((e) => (
                  <li key={e.id} className="flex items-center justify-between text-sm p-1 rounded hover:bg-muted/50">
                    <span className="flex items-center gap-2">
                      <span className="w-8 text-xs text-muted-foreground">{e.minute ? `${e.minute}'` : ''}</span>
                      <span className="font-medium">{e.player_name}</span> 
                      <span className="text-xs text-muted-foreground truncate w-24">({teamName(teams, e.team_id)})</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                        {e.event_type === 'goal' ? '⚽ Gol' : 
                         e.event_type === 'penalty_goal' ? '🎯 Penal' : 
                         e.event_type === 'own_goal' ? '❌ En contra' :
                         e.event_type === 'yellow_card' ? '🟨 Amarilla' :
                         e.event_type === 'red_card' ? '🟥 Roja' :
                         e.event_type === 'foul' ? '👟 Falta' :
                         e.event_type === 'shootout_goal' ? '✅ Tanda Gol' : '❌ Tanda Fallo'}
                      </span>
                    </span>
                    <form action={wrapAction(deleteMatchEventAction, "Evento eliminado")}>
                      <input type="hidden" name="id" value={e.id} />
                      <Button variant="ghost" size="sm" type="submit" className="h-6 text-destructive px-2">
                        Quitar
                      </Button>
                    </form>
                  </li>
                ))}
                {matchGoals.length === 0 ? <li className="text-sm text-muted-foreground">Sin eventos cargados</li> : null}
              </ul>
              
              <form action={wrapAction(addMatchEventAction, "Evento agregado")} className="grid gap-2 sm:grid-cols-6 p-2 border border-border rounded bg-muted/10">
                <input type="hidden" name="match_id" value={m.id} />
                
                <div className="sm:col-span-2">
                  <select name="team_id" className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm" required>
                    <option value={m.home_team_id}>{teamName(teams, m.home_team_id)}</option>
                    <option value={m.away_team_id}>{teamName(teams, m.away_team_id)}</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2">
                  <select name="event_type" className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm" required>
                    <option value="goal">⚽ Gol</option>
                    <option value="penalty_goal">🎯 Gol de Penal</option>
                    <option value="own_goal">❌ Gol en contra</option>
                    <option value="yellow_card">🟨 Tarjeta Amarilla</option>
                    <option value="red_card">🟥 Tarjeta Roja</option>
                    <option value="foul">👟 Falta</option>
                    <option value="shootout_goal">✅ Gol (Tanda Penales)</option>
                    <option value="shootout_miss">❌ Fallo (Tanda Penales)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <Input name="minute" type="number" min="1"  placeholder="Minuto (Ej: 15)" className="h-9" />
                </div>
                
                <div className="sm:col-span-6">
                  <select name="player_id" className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm" required>
                    <option value="">Seleccionar jugador...</option>
                    <optgroup label={teamName(teams, m.home_team_id)}>
                      {players.filter(p => p.team_id === m.home_team_id).map(p => (
                        <option key={p.id} value={p.id}>{p.name} {p.number ? `(#${p.number})` : ''}</option>
                      ))}
                    </optgroup>
                    <optgroup label={teamName(teams, m.away_team_id)}>
                      {players.filter(p => p.team_id === m.away_team_id).map(p => (
                        <option key={p.id} value={p.id}>{p.name} {p.number ? `(#${p.number})` : ''}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="sm:col-span-6 mt-1">
                  <Button type="submit" size="sm" variant="secondary" className="w-full">
                    Agregar Evento
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
