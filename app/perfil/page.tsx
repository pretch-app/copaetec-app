import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getUserProdeStats, getPredictionsByUser } from "@/lib/queries"
import { PageHeader } from "@/components/page-header"
import { Trophy, Target, Star, Calendar } from "lucide-react"

export const metadata = {
  title: "Mi Perfil | Copa ETec",
}

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const [stats, predictions] = await Promise.all([
    getUserProdeStats(user.id),
    getPredictionsByUser(user.id),
  ])

  const pendingCount = predictions.filter(p => p.points_awarded === null).length
  const finishedCount = predictions.filter(p => p.points_awarded !== null).length

  return (
    <div className="container py-8 md:py-12 animate-in fade-in duration-500">
      <PageHeader
        title="Mi Perfil"
        subtitle={`Hola, ${user.display_name}. Acá podés ver tu resumen.`}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
        <div className="rounded-xl border bg-surface-elevated p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
            <Trophy className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Puntos Predicciones ETec</p>
          <p className="text-3xl font-bold font-display">{stats?.total_points || 0}</p>
        </div>
        
        <div className="rounded-xl border bg-surface-elevated p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-4">
            <Star className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Posición Ranking</p>
          <p className="text-3xl font-bold font-display">#{stats?.rank || "-"}</p>
        </div>

        <div className="rounded-xl border bg-surface-elevated p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
            <Target className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Aciertos Exactos</p>
          <p className="text-3xl font-bold font-display">{stats?.exact_hits || 0}</p>
        </div>

        <div className="rounded-xl border bg-surface-elevated p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
            <Calendar className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Predicciones</p>
          <p className="text-3xl font-bold font-display">
            {predictions.length} <span className="text-sm font-normal text-muted-foreground">({pendingCount} ptes)</span>
          </p>
        </div>
      </div>
    </div>
  )
}
