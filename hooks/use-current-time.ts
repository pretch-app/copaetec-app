"use client"

import { useEffect, useState } from "react"

export function useCurrentTime(intervalMs = 15000) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const update = () => setNow(Date.now())
    const initialUpdate = setTimeout(update, 0)
    const interval = setInterval(update, intervalMs)

    return () => {
      clearTimeout(initialUpdate)
      clearInterval(interval)
    }
  }, [intervalMs])

  return now
}
