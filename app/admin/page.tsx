"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getMe, apiClient, type CurrentUser } from "@/lib/api-client"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import type { Team, Player, Match, MatchEvent, GalleryItem, TournamentSettings, NewsWithAuthor, User } from "@/lib/types"

type AdminData = {
  teams: Team[]
  players: Player[]
  matches: Match[]
  events: MatchEvent[]
  gallery: GalleryItem[]
  settings: TournamentSettings
  news: NewsWithAuthor[]
  users: User[]
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<CurrentUser>(null)
  const [data, setData] = useState<AdminData | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      const me = await getMe()
      if (!me || me.role !== "admin") {
        router.push("/auth/login")
        return
      }
      setUser(me)

      const [teams, players, matches, events, gallery, settings, news, users] = await Promise.all([
        apiClient<Team[]>("/api/teams"),
        apiClient<Player[]>("/api/players"),
        apiClient<Match[]>("/api/matches"),
        apiClient<MatchEvent[]>("/api/events"),
        apiClient<GalleryItem[]>("/api/gallery"),
        apiClient<TournamentSettings>("/api/settings"),
        apiClient<NewsWithAuthor[]>("/api/news"),
        apiClient<User[]>("/api/users"),
      ])

      if (teams.ok && players.ok && matches.ok && events.ok && gallery.ok && settings.ok && news.ok && users.ok) {
        setData({
          teams: teams.data,
          players: players.data,
          matches: matches.data,
          events: events.data,
          gallery: gallery.data,
          settings: settings.data,
          news: news.data,
          users: users.data,
        })
      }
      setLoaded(true)
    }
    load()
  }, [router])

  if (!loaded || !user || !data) {
    return <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">Cargando panel de administración…</div>
  }

  return (
    <AdminDashboard
      teams={data.teams}
      players={data.players}
      matches={data.matches}
      events={data.events}
      gallery={data.gallery}
      settings={data.settings}
      news={data.news}
      users={data.users}
    />
  )
}
