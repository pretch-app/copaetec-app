import { getStandings, getTournamentSettings } from "@/lib/queries"
import { GroupStandings } from "@/components/group-standings"
import { PageHeader } from "@/components/page-header"
import { Info } from "lucide-react"



export default async function PosicionesPage() {
  const [standings, settings] = await Promise.all([
    getStandings(),
    getTournamentSettings()
  ])

  return (
    <>
      <PageHeader
        title="Tabla de posiciones"
        subtitle="Sigue de cerca la campaña de cada equipo. Tres puntos por victoria, uno por empate."
        breadcrumbs={[{ label: "Posiciones" }]}
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
        
        {/* Info Banner */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 animate-fade-up">
          <div className="flex items-center gap-3 text-sm text-foreground/80 min-w-0 flex-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Info className="h-4 w-4" />
            </div>
            <p className="min-w-0 flex-1 break-words text-balance"><strong>Criterios de desempate:</strong> 1° Diferencia de gol (DG) · 2° Goles a favor (GF).</p>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-border" /> PJ: Partidos</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success" /> G: Ganados</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning" /> E: Empatados</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-destructive" /> P: Perdidos</span>
          </div>
        </div>

        <div className="animate-fade-up delay-100">
          <GroupStandings rows={standings} format={settings.format} />
        </div>
      </div>
    </>
  )
}
