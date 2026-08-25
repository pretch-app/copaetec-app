"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StandingsTable } from "@/components/standings-table"
import type { StandingRow } from "@/lib/types"

export function GroupStandings({ rows, format = "both" }: { rows: StandingRow[], format?: "general" | "groups" | "both" }) {
  // Group rows by 'grupo'
  const byGroup: Record<string, StandingRow[]> = {}
  for (const row of rows) {
    const g = row.grupo || "Sin Grupo"
    if (!byGroup[g]) byGroup[g] = []
    byGroup[g].push(row)
  }

  const groups = Object.keys(byGroup).sort()
  const hasMultipleGroups = groups.length > 1 || (groups.length === 1 && groups[0] !== "Sin Grupo")

  if (format === "general" || !hasMultipleGroups) {
    return <StandingsTable rows={rows} />
  }

  if (format === "groups") {
    return (
      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group} className="space-y-3">
            <h3 className="font-display text-xl font-bold tracking-tight">Grupo {group}</h3>
            <StandingsTable rows={byGroup[group]} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="general">Tabla General</TabsTrigger>
        <TabsTrigger value="groups">Fase de Grupos</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="mt-0">
        <StandingsTable rows={rows} />
      </TabsContent>
      <TabsContent value="groups" className="mt-0 space-y-8">
        {groups.map((group) => (
          <div key={group} className="space-y-3">
            <h3 className="font-display text-xl font-bold tracking-tight">Grupo {group}</h3>
            <StandingsTable rows={byGroup[group]} />
          </div>
        ))}
      </TabsContent>
    </Tabs>
  )
}
