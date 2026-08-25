"use client"

import { useEffect, useState } from "react"
import { Trophy, Medal } from "lucide-react"
import { getMe } from "@/lib/api-client"
import type { ProdeRankingEntry } from "@/lib/types"

export function RankingTable({ ranking }: { ranking: ProdeRankingEntry[] }) {
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    getMe().then((u) => setUserId(u?.id ?? null))
  }, [])

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b bg-muted/50 text-muted-foreground">
          <th className="px-4 py-3 text-center font-semibold w-16">Pos</th>
          <th className="px-4 py-3 text-left font-semibold">Participante</th>
          <th className="px-4 py-3 text-center font-semibold">Puntos</th>
          <th className="px-4 py-3 text-center font-semibold hidden sm:table-cell">Plenos (5p)</th>
          <th className="px-4 py-3 text-center font-semibold hidden sm:table-cell">Aciertos (2p/3p)</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {ranking.map((entry, i) => {
          const isUser = userId === entry.user_id

          let PosIcon = null
          let posColor = "text-muted-foreground"

          if (i === 0) {
            PosIcon = Trophy
            posColor = "text-yellow-500"
          } else if (i === 1) {
            PosIcon = Medal
            posColor = "text-zinc-400"
          } else if (i === 2) {
            PosIcon = Medal
            posColor = "text-amber-600"
          }

          return (
            <tr
              key={entry.user_id}
              className={`transition-colors hover:bg-muted/50 ${isUser ? "bg-primary/5 hover:bg-primary/10" : ""}`}
            >
              <td className="px-4 py-4 text-center font-bold">
                <div className={`flex justify-center items-center ${posColor}`}>
                  {PosIcon ? <PosIcon className="h-5 w-5" /> : <span>{i + 1}</span>}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {entry.display_name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`font-medium ${isUser ? 'text-primary' : ''}`}>
                    {entry.display_name} {isUser && "(Vos)"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 text-center">
                <span className="font-display font-bold text-lg">{entry.total_points}</span>
              </td>
              <td className="px-4 py-4 text-center hidden sm:table-cell text-muted-foreground">
                {entry.exact_hits}
              </td>
              <td className="px-4 py-4 text-center hidden sm:table-cell text-muted-foreground">
                {entry.winner_hits}
              </td>
            </tr>
          )
        })}
        {ranking.length === 0 && (
          <tr>
            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
              Todavía no hay puntos calculados en el ranking.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
