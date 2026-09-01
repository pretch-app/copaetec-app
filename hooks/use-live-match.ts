"use client"

import { useState, useEffect } from "react"
import type { Match } from "@/lib/types"
import { apiUrl } from "@/lib/api"

export function useLiveMatch(initialMatch: Match) {
  const [match, setMatch] = useState<Match>(initialMatch)

  // Keep in sync if initialMatch changes (e.g., from server actions)
  useEffect(() => {
    const syncTimer = setTimeout(() => setMatch(initialMatch), 0)
    return () => clearTimeout(syncTimer)
  }, [initialMatch])

  useEffect(() => {
    const kickoffTime = match.kickoff ? new Date(match.kickoff).getTime() : 0
    if (match.status !== "scheduled" || !kickoffTime || Number.isNaN(kickoffTime)) return

    const poll = async () => {
      if (kickoffTime > Date.now() + 60 * 60 * 1000) return
      try {
        const res = await fetch(apiUrl("/api/matches/live"))
        if (res.ok) {
          const data: Array<{ id: number; home_score: number | null; away_score: number | null; status: Match["status"] }> = await res.json()
          const updatedMatch = data.find((m) => m.id === match.id)
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
    }

    const startPollingAfter = Math.max(0, kickoffTime - Date.now() - 60 * 60 * 1000)
    const timeout = setTimeout(() => {
      void poll()
      interval = setInterval(() => void poll(), 15000)
    }, startPollingAfter)
    let interval: ReturnType<typeof setInterval> | undefined

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [match.id, match.status, match.kickoff])

  return match
}
