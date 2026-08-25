"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { put } from "@vercel/blob"
import { sql } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { internalCalculateMatchPoints } from "@/app/predicciones-etec/actions"
import { getMatchById } from "@/lib/queries"

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

async function requireAuth() {
  await requireAdmin()
}

function toInt(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null
  const n = Number.parseInt(String(value), 10)
  return Number.isNaN(n) ? null : n
}

function toStr(value: FormDataEntryValue | null): string | null {
  if (value === null) return null
  const s = String(value).trim()
  return s === "" ? null : s
}

function revalidateAll() {
  revalidatePath("/", "layout")
}

async function syncMatchScore(matchId: number) {
  const matchRow = await sql`SELECT home_team_id, away_team_id, status FROM matches WHERE id = ${matchId}`
  const match = matchRow[0]
  if (!match) return

  const goals = await sql`SELECT team_id, goals_count FROM goals WHERE match_id = ${matchId}`
  
  let homeScore = 0
  let awayScore = 0
  
  for (const g of goals) {
    if (g.team_id === match.home_team_id) {
      homeScore += g.goals_count
    } else if (g.team_id === match.away_team_id) {
      awayScore += g.goals_count
    }
  }

  await sql`
    UPDATE matches 
    SET home_score = ${homeScore}, away_score = ${awayScore}
    WHERE id = ${matchId}
  `

  if (match.status === "finished") {
    await internalCalculateMatchPoints(matchId).catch(console.error)
  }
}

const VALID_STAGES = ["group", "round_of_16", "quarter_finals", "semi_finals", "final"]
const VALID_STATUS = ["scheduled", "finished"]

// ---------- Settings ----------

export async function saveTournamentSettingsAction(formData: FormData) {
  await requireAuth()
  const name = toStr(formData.get("tournament_name")) || "Copa ETec 2026"
  const format = toStr(formData.get("format")) || "general"
  const knockout_source = toStr(formData.get("knockout_source")) || "general"
  const num_teams = toInt(formData.get("num_teams_advancing")) || 8
  
  const match_duration = toInt(formData.get("match_duration")) || 90
  const group_tiebreaker = toStr(formData.get("group_tiebreaker")) || "none"
  const knockout_tiebreaker = toStr(formData.get("knockout_tiebreaker")) || "penalties"

  await sql`
    UPDATE tournament_settings 
    SET tournament_name = ${name},
        format = ${format},
        knockout_source = ${knockout_source},
        num_teams_advancing = ${num_teams},
        match_duration = ${match_duration},
        group_tiebreaker = ${group_tiebreaker},
        knockout_tiebreaker = ${knockout_tiebreaker},
        updated_at = NOW()
  `
  revalidateAll()
}

export async function autoGenerateBracketAction(formData: FormData) {
  await requireAuth()
  
  // Get settings and standings
  const { getTournamentSettings, getStandings } = await import("@/lib/queries")
  const settings = await getTournamentSettings()
  const standings = await getStandings()
  
  const n = settings.num_teams_advancing
  if (![2, 4, 8, 16].includes(n)) return // Invalid number

  const topTeams = standings.slice(0, n)
  if (topTeams.length < n) {
    throw new Error(`No hay suficientes equipos. Se necesitan ${n}, pero solo hay ${topTeams.length}.`)
  }

  // Determine stage
  let stage = "final"
  if (n === 16) stage = "round_of_16"
  else if (n === 8) stage = "quarter_finals"
  else if (n === 4) stage = "semi_finals"

  let matchday = 100
  if (n === 16) matchday = 101
  else if (n === 8) matchday = 102
  else if (n === 4) matchday = 103
  else if (n === 2) matchday = 104

  // Check if matches for this stage already exist
  const existingRows = await sql`SELECT id FROM matches WHERE stage = ${stage} LIMIT 1`
  if (existingRows.length > 0) {
    throw new Error("Ya existen partidos creados para esta fase. Bórralos primero si quieres volver a generar las llaves.")
  }

  // Generate pairs: 1 vs N, 2 vs N-1...
  for (let i = 0; i < n / 2; i++) {
    const homeTeam = topTeams[i]
    const awayTeam = topTeams[n - 1 - i]

    await sql`
      INSERT INTO matches (home_team_id, away_team_id, stage, matchday, status)
      VALUES (${homeTeam.team_id}, ${awayTeam.team_id}, ${stage}, ${matchday}, 'scheduled')
    `
  }
  
  revalidateAll()
}

// Auth actions moved to app/auth/actions.ts

// ---------- Teams ----------

export async function createTeamAction(formData: FormData) {
  await requireAuth()
  const name = toStr(formData.get("name"))
  if (!name) return
  const slug = slugify(name)
  await sql`
    INSERT INTO teams (name, slug, captain, grupo)
    VALUES (${name}, ${slug}, ${toStr(formData.get("captain"))}, ${toStr(formData.get("grupo"))})
    ON CONFLICT (slug) DO NOTHING
  `
  revalidateAll()
}

export async function updateTeamAction(formData: FormData) {
  await requireAuth()
  const id = toInt(formData.get("id"))
  const name = toStr(formData.get("name"))
  if (!id || !name) return
  await sql`
    UPDATE teams SET
      name = ${name},
      captain = ${toStr(formData.get("captain"))},
      grupo = ${toStr(formData.get("grupo"))}
    WHERE id = ${id}
  `
  revalidateAll()
}

export async function deleteTeamAction(formData: FormData) {
  await requireAuth()
  const id = toInt(formData.get("id"))
  if (!id) return
  await sql`DELETE FROM teams WHERE id = ${id}`
  revalidateAll()
}

export async function uploadTeamPhotoAction(formData: FormData) {
  await requireAuth()
  const id = toInt(formData.get("id"))
  const file = formData.get("photo") as File | null
  
  if (!id || !file || file.size === 0) return { error: "Archivo inválido" }
  if (file.size > 5 * 1024 * 1024) return { error: "El archivo no puede pesar más de 5MB" }
  if (!file.type.startsWith("image/")) return { error: "El archivo debe ser una imagen" }
  
  const blob = await put(`teams/${id}-${Date.now()}-${slugify(file.name)}`, file, { access: "public" })
  await sql`UPDATE teams SET photo_url = ${blob.url} WHERE id = ${id}`
  revalidateAll()
  return { success: true }
}

export async function uploadTeamEscudoAction(formData: FormData) {
  await requireAuth()
  const id = toInt(formData.get("id"))
  const file = formData.get("escudo") as File | null
  
  if (!id || !file || file.size === 0) return { error: "Archivo inválido" }
  if (file.size > 5 * 1024 * 1024) return { error: "El archivo no puede pesar más de 5MB" }
  if (!file.type.startsWith("image/")) return { error: "El archivo debe ser una imagen" }
  
  const blob = await put(`teams/escudos/${id}-${Date.now()}-${slugify(file.name)}`, file, { access: "public" })
  await sql`UPDATE teams SET escudo_url = ${blob.url} WHERE id = ${id}`
  revalidateAll()
  return { success: true }
}

// ---------- Players ----------

export async function createPlayerAction(formData: FormData) {
  await requireAuth()
  const teamId = toInt(formData.get("team_id"))
  const name = toStr(formData.get("name"))
  if (!teamId || !name) return
  await sql`
    INSERT INTO players (team_id, name, number, position)
    VALUES (${teamId}, ${name}, ${toInt(formData.get("number"))}, ${toStr(formData.get("position"))})
  `
  revalidateAll()
}

export async function deletePlayerAction(formData: FormData) {
  await requireAuth()
  const id = toInt(formData.get("id"))
  if (!id) return
  await sql`DELETE FROM players WHERE id = ${id}`
  revalidateAll()
}

// ---------- Matches ----------

export async function autoGenerateGroupFixtureAction(formData: FormData) {
  await requireAuth()
  const isDoubleRoundRobin = formData.get("double_round_robin") === "on"
  const clearExisting = formData.get("clear_existing") === "on"
  const randomize = formData.get("randomize") === "on"

  if (clearExisting) {
    await sql`DELETE FROM matches WHERE stage = 'group' OR stage IS NULL`
  }

  // Get all teams
  const { getTeams } = await import("@/lib/queries")
  const allTeams = await getTeams()

  // Group teams by 'grupo'
  const groups: Record<string, typeof allTeams> = {}
  for (const t of allTeams) {
    const g = t.grupo || "General"
    if (!groups[g]) groups[g] = []
    groups[g].push(t)
  }

  for (const [groupName, groupTeams] of Object.entries(groups)) {
    if (groupTeams.length < 2) continue;

    let teams = [...groupTeams]
    if (randomize) {
      teams = teams.sort(() => Math.random() - 0.5)
    }

    const n = teams.length
    const hasGhost = n % 2 !== 0
    const totalTeams = hasGhost ? n + 1 : n
    const indices = Array.from({ length: totalTeams }, (_, i) => i)
    const numRounds = totalTeams - 1
    const half = totalTeams / 2

    const matchesToInsert: { homeId: number; awayId: number; matchday: number }[] = []

    for (let round = 0; round < numRounds; round++) {
      for (let i = 0; i < half; i++) {
        const homeIdx = indices[i]
        const awayIdx = indices[totalTeams - 1 - i]
        
        if (hasGhost && (homeIdx === totalTeams - 1 || awayIdx === totalTeams - 1)) {
          // This team gets a bye
          continue
        }

        let homeTeam = teams[homeIdx]
        let awayTeam = teams[awayIdx]

        // Alternate home/away for the first team
        if (i === 0 && round % 2 !== 0) {
          const temp = homeTeam
          homeTeam = awayTeam
          awayTeam = temp
        }

        matchesToInsert.push({
          homeId: homeTeam.id,
          awayId: awayTeam.id,
          matchday: round + 1
        })
      }
      
      // Rotate indices
      indices.splice(1, 0, indices.pop()!)
    }

    // Double round robin
    if (isDoubleRoundRobin) {
      const existingCount = matchesToInsert.length
      for (let i = 0; i < existingCount; i++) {
        const m = matchesToInsert[i]
        matchesToInsert.push({
          homeId: m.awayId,
          awayId: m.homeId,
          matchday: m.matchday + numRounds
        })
      }
    }

    // Insert matches
    for (const m of matchesToInsert) {
      await sql`
        INSERT INTO matches (matchday, kickoff, venue, home_team_id, away_team_id, status, stage)
        VALUES (${m.matchday}, NULL, NULL, ${m.homeId}, ${m.awayId}, 'scheduled', 'group')
      `
    }
  }

  revalidateAll()
  return { success: true }
}

export async function createMatchAction(formData: FormData) {
  await requireAuth()
  const homeId = toInt(formData.get("home_team_id"))
  const awayId = toInt(formData.get("away_team_id"))
  const matchday = toInt(formData.get("matchday")) ?? 1
  const stage = toStr(formData.get("stage")) ?? "group"
  if (!VALID_STAGES.includes(stage)) return { error: "Fase inválida" }
  
  if (!homeId || !awayId || homeId === awayId) return { error: "Equipos inválidos" }
  let kickoff = toStr(formData.get("kickoff"))
  if (kickoff && kickoff.length === 16) {
    kickoff += "-03:00"
  }
  await sql`
    INSERT INTO matches (matchday, kickoff, venue, home_team_id, away_team_id, status, stage)
    VALUES (${matchday}, ${kickoff}, ${toStr(formData.get("venue"))}, ${homeId}, ${awayId}, 'scheduled', ${stage})
  `
  revalidateAll()
}

export async function updateMatchResultAction(formData: FormData) {
  await requireAuth()
  const id = toInt(formData.get("id"))
  if (!id) return
  
  const status = toStr(formData.get("status")) || "scheduled"
  if (!VALID_STATUS.includes(status)) return { error: "Estado inválido" }
  
  let kickoff = toStr(formData.get("kickoff"))
  if (kickoff && kickoff.length === 16) {
    kickoff += "-03:00"
  }
  const matchday = toInt(formData.get("matchday"))
  const venue = toStr(formData.get("venue"))

  await sql`
    UPDATE matches SET
      report = ${toStr(formData.get("report"))},
      status = ${status},
      kickoff = COALESCE(${kickoff}, kickoff),
      matchday = COALESCE(${matchday}, matchday),
      venue = COALESCE(${venue}, venue)
    WHERE id = ${id}
  `
  
  if (status === "finished") {
    await internalCalculateMatchPoints(id).catch(console.error)
  }
  
  revalidateAll()
  return { success: true }
}

export async function deleteMatchAction(formData: FormData) {
  await requireAuth()
  const id = toInt(formData.get("id"))
  if (!id) return
  await sql`DELETE FROM matches WHERE id = ${id}`
  revalidateAll()
}

// ---------- Match Events & Extras ----------

export async function updateMatchExtrasAction(formData: FormData) {
  await requireAdmin()
  const id = toInt(formData.get("id"))
  if (!id) return { error: "ID inválido" }

  const homePenalties = formData.get("home_penalties") ? toInt(formData.get("home_penalties")) : null
  const awayPenalties = formData.get("away_penalties") ? toInt(formData.get("away_penalties")) : null
  const isExtraTime = formData.get("is_extra_time") === "on"

  await sql`
    UPDATE matches
    SET home_penalties = ${homePenalties}, away_penalties = ${awayPenalties}, is_extra_time = ${isExtraTime}
    WHERE id = ${id}
  `
  
  const status = toStr(formData.get("status")) || "scheduled"
  if (status === "finished") {
    await internalCalculateMatchPoints(id).catch(console.error)
  }

  revalidateAll()
  return { success: true }
}

export async function addMatchEventAction(formData: FormData) {
  await requireAdmin()
  const matchId = toInt(formData.get("match_id"))
  const teamId = toInt(formData.get("team_id"))
  const playerId = toInt(formData.get("player_id")) || null
  let playerName = toStr(formData.get("player_name"))

  if (!playerName && playerId) {
    const playerRows = await sql`SELECT name FROM players WHERE id = ${playerId}`
    if (playerRows.length > 0) playerName = playerRows[0].name
  }

  const eventType = toStr(formData.get("event_type"))
  const minuteStr = toStr(formData.get("minute"))
  const minute = minuteStr ? toInt(minuteStr) : null

  if (!matchId || !teamId || !playerName || !eventType) {
    return { error: "Faltan datos para el evento" }
  }

  const validTypes = ['goal', 'penalty_goal', 'own_goal', 'yellow_card', 'red_card', 'foul', 'shootout_goal', 'shootout_miss']
  if (!validTypes.includes(eventType)) {
    return { error: "Tipo de evento inválido" }
  }

  await sql`
    INSERT INTO match_events (match_id, team_id, player_id, player_name, event_type, minute)
    VALUES (${matchId}, ${teamId}, ${playerId}, ${playerName}, ${eventType}, ${minute})
  `
  
  if (['goal', 'penalty_goal', 'own_goal'].includes(eventType)) {
    const match = await getMatchById(matchId)
    if (match) {
      const scoringTeamId = eventType === 'own_goal' 
        ? (match.home_team_id === teamId ? match.away_team_id : match.home_team_id)
        : teamId

      const homeInc = scoringTeamId === match.home_team_id ? 1 : 0
      const awayInc = scoringTeamId === match.away_team_id ? 1 : 0
      
      await sql`
        UPDATE matches
        SET home_score = COALESCE(home_score, 0) + ${homeInc},
            away_score = COALESCE(away_score, 0) + ${awayInc}
        WHERE id = ${matchId}
      `
      if (match.status === "finished") {
        await internalCalculateMatchPoints(matchId).catch(console.error)
      }
    }
  }

  revalidateAll()
  return { success: true }
}

export async function deleteMatchEventAction(formData: FormData) {
  await requireAdmin()
  const id = toInt(formData.get("id"))
  if (!id) return { error: "ID inválido" }

  const events = await sql`SELECT * FROM match_events WHERE id = ${id} LIMIT 1`
  const event = events[0]
  
  if (!event) return { error: "Evento no encontrado" }

  await sql`DELETE FROM match_events WHERE id = ${id}`

  if (['goal', 'penalty_goal', 'own_goal'].includes(event.event_type)) {
    const match = await getMatchById(event.match_id)
    if (match) {
      const scoringTeamId = event.event_type === 'own_goal' 
        ? (match.home_team_id === event.team_id ? match.away_team_id : match.home_team_id)
        : event.team_id

      const homeDec = scoringTeamId === match.home_team_id ? 1 : 0
      const awayDec = scoringTeamId === match.away_team_id ? 1 : 0
      
      await sql`
        UPDATE matches
        SET home_score = GREATEST(COALESCE(home_score, 0) - ${homeDec}, 0),
            away_score = GREATEST(COALESCE(away_score, 0) - ${awayDec}, 0)
        WHERE id = ${match.id}
      `
      if (match.status === "finished") {
        await internalCalculateMatchPoints(match.id).catch(console.error)
      }
    }
  }

  revalidateAll()
  return { success: true }
}

// ---------- Gallery ----------

export async function uploadGalleryAction(formData: FormData) {
  await requireAuth()
  const file = formData.get("photo") as File | null
  
  if (!file || file.size === 0) return { error: "Archivo inválido" }
  if (file.size > 10 * 1024 * 1024) return { error: "El archivo no puede pesar más de 10MB" }
  if (!file.type.startsWith("image/")) return { error: "El archivo debe ser una imagen" }

  const blob = await put(`gallery/${Date.now()}-${slugify(file.name)}`, file, { access: "public" })
  await sql`INSERT INTO gallery (url, caption) VALUES (${blob.url}, ${toStr(formData.get("caption"))})`
  revalidateAll()
  return { success: true }
}

export async function deleteGalleryAction(formData: FormData) {
  await requireAuth()
  const id = toInt(formData.get("id"))
  if (!id) return
  await sql`DELETE FROM gallery WHERE id = ${id}`
  revalidateAll()
}

// ---------- News ----------

export async function createNewsAction(formData: FormData) {
  const user = await requireAdmin()
  const title = toStr(formData.get("title"))
  const content = toStr(formData.get("content"))
  const color = toStr(formData.get("color")) || "blue"
  const youtubeUrl = toStr(formData.get("youtube_url"))
  const file = formData.get("photo") as File | null
  
  if (!title || !content) return { error: "El título y la descripción son obligatorios" }
  
  let imageUrl = null
  if (file && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) return { error: "El archivo no puede pesar más de 10MB" }
    if (!file.type.startsWith("image/")) return { error: "El archivo debe ser una imagen" }
    const blob = await put(`news/${Date.now()}-${slugify(file.name)}`, file, { access: "public" })
    imageUrl = blob.url
  }

  let youtubeId = null
  if (youtubeUrl) {
    const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
    youtubeId = match ? match[1] : null
  }

  await sql`
    INSERT INTO news (title, content, image_url, youtube_id, color, author_id)
    VALUES (${title}, ${content}, ${imageUrl}, ${youtubeId}, ${color}, ${user.id})
  `
  revalidateAll()
  return { success: true }
}

export async function deleteNewsAction(formData: FormData) {
  await requireAdmin()
  const id = toInt(formData.get("id"))
  if (!id) return { error: "ID inválido" }
  await sql`DELETE FROM news WHERE id = ${id}`
  revalidateAll()
  return { success: true }
}

// ---------- Users ----------

export async function deleteUserAction(formData: FormData) {
  const currentUser = await requireAdmin()
  const id = toInt(formData.get("id"))
  if (!id) return { error: "ID inválido" }
  if (id === currentUser.id) return { error: "No puedes eliminar tu propio usuario" }
  
  await sql`DELETE FROM users WHERE id = ${id}`
  revalidateAll()
  return { success: true }
}
