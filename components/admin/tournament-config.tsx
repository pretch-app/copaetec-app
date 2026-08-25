"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { saveTournamentSettingsAction } from "@/app/admin/actions"
import type { TournamentSettings } from "@/lib/types"

export function TournamentConfig({ settings }: { settings: TournamentSettings }) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Configuración del Torneo</CardTitle>
          <CardDescription>
            Define cómo se mostrarán las posiciones y cómo se organizan las fases eliminatorias.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveTournamentSettingsAction} className="grid gap-5">
            <div className="flex flex-col gap-2 border-b border-border pb-5">
              <Label className="text-base font-semibold">Nombre del Torneo</Label>
              <Input name="tournament_name" defaultValue={settings.tournament_name || "Copa ETec 2026"} className="max-w-md" />
              <p className="text-xs text-muted-foreground">Este nombre aparecerá en la barra superior de todo el sitio.</p>
            </div>

            <div className="flex flex-col gap-2 border-b border-border pb-5">
              <Label className="text-base font-semibold">Formato de Fase Regular (Posiciones)</Label>
              <select 
                name="format" 
                defaultValue={settings.format} 
                className="h-10 max-w-md rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="general">Solo Tabla General (todos los equipos)</option>
                <option value="groups">Solo Fase de Grupos</option>
                <option value="both">Ambos (Pestañas de General y Grupos)</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Si eliges Fase de Grupos, recuerda asignarle un "Grupo" a cada equipo al crearlo o editarlo.
              </p>
            </div>

            <div className="flex flex-col gap-2 border-b border-border pb-5">
              <Label className="text-base font-semibold">Clasificación a Eliminatorias</Label>
              
              <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
                <div className="flex flex-col gap-1">
                  <Label className="text-sm">¿Cuántos equipos clasifican a llaves?</Label>
                  <select 
                    name="num_teams_advancing" 
                    defaultValue={settings.num_teams_advancing} 
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="16">16 equipos (Arranca en Octavos)</option>
                    <option value="8">8 equipos (Arranca en Cuartos)</option>
                    <option value="4">4 equipos (Arranca en Semifinales)</option>
                    <option value="2">2 equipos (Directo a Final)</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1">
                  <Label className="text-sm">¿De dónde salen los clasificados?</Label>
                  <select 
                    name="knockout_source" 
                    defaultValue={settings.knockout_source} 
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="general">De la Tabla General</option>
                    <option value="groups">De los Grupos</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pb-2">
              <Label className="text-base font-semibold">Reglas de Partido</Label>
              
              <div className="grid gap-4 sm:grid-cols-3 max-w-4xl">
                <div className="flex flex-col gap-1">
                  <Label className="text-sm">Duración del Partido (minutos)</Label>
                  <Input 
                    type="number"
                    name="match_duration" 
                    defaultValue={settings.match_duration ?? 90} 
                    className="h-10 max-w-[120px]"
                    min="1"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <Label className="text-sm">Desempate (Fase Regular)</Label>
                  <select 
                    name="group_tiebreaker" 
                    defaultValue={settings.group_tiebreaker ?? "none"} 
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="none">Ninguno (Se permiten empates)</option>
                    <option value="penalties">Penales directo</option>
                    <option value="extra_time">Solo Alargue</option>
                    <option value="extra_time_and_penalties">Alargue y luego Penales</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-sm">Desempate (Llaves / Eliminatorias)</Label>
                  <select 
                    name="knockout_tiebreaker" 
                    defaultValue={settings.knockout_tiebreaker ?? "penalties"} 
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="none">Ninguno</option>
                    <option value="penalties">Penales directo</option>
                    <option value="extra_time">Solo Alargue</option>
                    <option value="extra_time_and_penalties">Alargue y luego Penales</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit">Guardar Configuración</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
