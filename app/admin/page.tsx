import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getTeams, getAllPlayers, getMatches, getAllEvents, getGallery, getTournamentSettings, getAllNews, getAllUsers } from "@/lib/queries"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Administración | Copa ETec",
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    redirect("/auth/login")
  }

  const [teams, players, matches, events, gallery, settings, news, users] = await Promise.all([
    getTeams(),
    getAllPlayers(),
    getMatches(),
    getAllEvents(),
    getGallery(),
    getTournamentSettings(),
    getAllNews(),
    getAllUsers(),
  ])

  return <AdminDashboard teams={teams} players={players} matches={matches} events={events} gallery={gallery} settings={settings} news={news} users={users} />
}

