import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Users, Shield } from "lucide-react"
import { getTeams } from "@/lib/queries"
import { PageHeader } from "@/components/page-header"
import { TeamBadge } from "@/components/team-badge"
import { cn } from "@/lib/utils"



export default async function EquiposPage() {
  const teams = await getTeams()

  return (
    <>
      <PageHeader 
        title="Equipos" 
        subtitle="Conocé a los planteles que compiten por la Copa ETec 2026." 
        breadcrumbs={[{ label: "Equipos" }]}
      />
      <div className="mx-auto max-w-6xl px-4 py-16">
        {teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-elevated/50 px-6 py-20 text-center animate-fade-up">
            <Users className="h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-4 font-display text-xl font-bold">Todavía no hay equipos</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Los equipos inscritos aparecerán aquí próximamente.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team, i) => (
              <Link
                key={team.id}
                href={`/equipos/${team.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface-elevated transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 animate-fade-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-secondary">
                  {team.photo_url ? (
                    <>
                      <Image
                        src={team.photo_url || "/placeholder.svg"}
                        alt={`Plantel de ${team.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                    </>
                  ) : (
                    <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <TeamBadge name={team.name} photoUrl={team.escudo_url || team.photo_url} size="lg" className="h-20 w-20 text-3xl shadow-lg transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  )}
                  
                  {/* Floating badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {team.grupo && (
                      <span className="rounded-full bg-background/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-foreground shadow-sm">
                        Grupo {team.grupo}
                      </span>
                    )}
                  </div>
                  {team.escudo_url && (
                    <div className="absolute top-3 left-3">
                      <TeamBadge name={team.name} photoUrl={team.escudo_url} size="md" className="shadow-lg border-2 border-background/20" />
                    </div>
                  )}
                  
                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-5">
                    <h2 className="truncate font-display text-2xl font-bold tracking-tight text-white drop-shadow-md">
                      {team.name}
                    </h2>
                    {team.captain && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                        <Shield className="h-3.5 w-3.5" /> Cap. {team.captain}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between gap-2 p-4 bg-card transition-colors group-hover:bg-primary/5">
                  <span className="text-sm font-medium text-primary">Ver perfil del equipo</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:translate-x-1 group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
