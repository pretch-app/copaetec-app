import { apiGet } from "@/lib/api"
import type { ProdeRankingEntry } from "@/lib/types"
import { PageHeader } from "@/components/page-header"
import { RankingTable } from "@/components/prode/ranking-table"

export const metadata = {
  title: "Ranking Predicciones ETec | Copa ETec",
}

export default async function ProdeRankingPage() {
  const ranking = await apiGet<ProdeRankingEntry[]>("/api/predictions/ranking?limit=100")

  return (
    <div className="container py-8 md:py-12 animate-in fade-in duration-500">
      <PageHeader
        title="Ranking Global"
        subtitle="Los mejores de Predicciones ETec. 5 pts por resultado exacto, 3 pts por diferencia, 2 pts por ganador."
      />

      <div className="max-w-4xl mx-auto mt-8">
        <div className="rounded-xl border bg-surface-elevated overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <RankingTable ranking={ranking} />
          </div>
        </div>
      </div>
    </div>
  )
}
