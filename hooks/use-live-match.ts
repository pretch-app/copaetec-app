"use client"

import { useState, useEffect } from "react"
import type { Match } from "@/lib/types"

export function useLiveMatch(initialMatch: Match) {
  const [match, setMatch] = useState<Match>(initialMatch)

  // Keep in sync if initialMatch changes (e.g., from server actions)
  useEffect(() => {
    setMatch(initialMatch)
  }, [initialMatch])

  useEffect(() => {
    // Only poll if the match is scheduled and kickoff is past or near (within 1 hour)
    // Or if it's explicitly "scheduled" but clearly past time.
    const kickoffTime = match.kickoff ? new Date(match.kickoff).getTime() : 0
    const isLiveOrSoon = match.status === "scheduled" && kickoffTime && (kickoffTime <= Date.now() + 60 * 60 * 1000)

    if (!isLiveOrSoon) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/matches/live")
        if (res.ok) {
          const data = await res.json()
          const updatedMatch = data.find((m: any) => m.id === match.id)
          if (updatedMatch) {
            setMatch(prev => ({
              ...prev,
              home_score: updatedMatch.home_score,
              away_score: updatedMatch.away_score,
              status: updatedMatch.status
            }))
          }
        }
      } catch (e) {
        // silently ignore polling errors
      }
    }, 15000) // 15s

    return () => clearInterval(interval)
  }, [match.id, match.status, match.kickoff])

  return match
}
