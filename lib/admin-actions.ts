"use client"

import { apiClient } from "./api-client"

export type ActionResult = { error?: string; success?: boolean }

function jsonBody(formData: FormData, keys: string[]) {
  const body: Record<string, unknown> = {}
  for (const key of keys) {
    const value = formData.get(key)
    if (value === null) continue
    body[key] = value
  }
  return body
}

function toResult(result: Awaited<ReturnType<typeof apiClient>>): ActionResult {
  return result.ok ? { success: true } : { error: result.error }
}

// ---------- Settings ----------

export async function saveTournamentSettingsAction(formData: FormData): Promise<ActionResult> {
  const result = await apiClient("/api/settings", {
    method: "PATCH",
    body: jsonBody(formData, [
      "tournament_name",
      "format",
      "knockout_source",
      "num_teams_advancing",
      "match_duration",
      "group_tiebreaker",
      "knockout_tiebreaker",
    ]),
  })
  return toResult(result)
}

export async function autoGenerateGroupFixtureAction(formData: FormData): Promise<ActionResult> {
  const result = await apiClient("/api/matches/generate-fixture", {
    method: "POST",
    body: {
      double_round_robin: formData.get("double_round_robin") === "on",
      clear_existing: formData.get("clear_existing") === "on",
      randomize: formData.get("randomize") === "on",
    },
  })
  return toResult(result)
}

export async function autoGenerateBracketAction(_formData: FormData): Promise<ActionResult> {
  const result = await apiClient("/api/matches/generate-bracket", { method: "POST" })
  return toResult(result)
}

// ---------- Teams ----------

export async function createTeamAction(formData: FormData): Promise<ActionResult> {
  const result = await apiClient("/api/teams", {
    method: "POST",
    body: jsonBody(formData, ["name", "captain", "grupo"]),
  })
  return toResult(result)
}

export async function updateTeamAction(formData: FormData): Promise<ActionResult> {
  const id = formData.get("id")
  const result = await apiClient(`/api/teams/${id}`, {
    method: "PATCH",
    body: jsonBody(formData, ["name", "captain", "grupo"]),
  })
  return toResult(result)
}

export async function deleteTeamAction(formData: FormData): Promise<ActionResult> {
  const id = formData.get("id")
  const result = await apiClient(`/api/teams/${id}`, { method: "DELETE" })
  return toResult(result)
}

export async function uploadTeamPhotoAction(formData: FormData): Promise<ActionResult> {
  const id = formData.get("id")
  const result = await apiClient(`/api/teams/${id}/photo`, { method: "POST", formData })
  return toResult(result)
}

export async function uploadTeamEscudoAction(formData: FormData): Promise<ActionResult> {
  const id = formData.get("id")
  const result = await apiClient(`/api/teams/${id}/escudo`, { method: "POST", formData })
  return toResult(result)
}

// ---------- Players ----------

export async function createPlayerAction(formData: FormData): Promise<ActionResult> {
  const result = await apiClient("/api/players", {
    method: "POST",
    body: jsonBody(formData, ["team_id", "name", "number", "position"]),
  })
  return toResult(result)
}

export async function deletePlayerAction(formData: FormData): Promise<ActionResult> {
  const id = formData.get("id")
  const result = await apiClient(`/api/players/${id}`, { method: "DELETE" })
  return toResult(result)
}

// ---------- Matches ----------

export async function createMatchAction(formData: FormData): Promise<ActionResult> {
  const result = await apiClient("/api/matches", {
    method: "POST",
    body: jsonBody(formData, ["home_team_id", "away_team_id", "matchday", "stage", "kickoff", "venue"]),
  })
  return toResult(result)
}

export async function updateMatchResultAction(formData: FormData): Promise<ActionResult> {
  const id = formData.get("id")
  const result = await apiClient(`/api/matches/${id}`, {
    method: "PATCH",
    body: jsonBody(formData, ["status", "kickoff", "matchday", "venue", "report"]),
  })
  return toResult(result)
}

export async function updateMatchExtrasAction(formData: FormData): Promise<ActionResult> {
  const id = formData.get("id")
  const result = await apiClient(`/api/matches/${id}/extras`, {
    method: "PATCH",
    body: {
      home_penalties: formData.get("home_penalties"),
      away_penalties: formData.get("away_penalties"),
      is_extra_time: formData.get("is_extra_time") === "on",
      status: formData.get("status"),
    },
  })
  return toResult(result)
}

export async function deleteMatchAction(formData: FormData): Promise<ActionResult> {
  const id = formData.get("id")
  const result = await apiClient(`/api/matches/${id}`, { method: "DELETE" })
  return toResult(result)
}

// ---------- Match Events ----------

export async function addMatchEventAction(formData: FormData): Promise<ActionResult> {
  const matchId = formData.get("match_id")
  const result = await apiClient(`/api/matches/${matchId}/events`, {
    method: "POST",
    body: jsonBody(formData, ["team_id", "player_id", "player_name", "event_type", "minute"]),
  })
  return toResult(result)
}

export async function deleteMatchEventAction(formData: FormData): Promise<ActionResult> {
  const id = formData.get("id")
  const result = await apiClient(`/api/events/${id}`, { method: "DELETE" })
  return toResult(result)
}

// ---------- Gallery ----------

export async function uploadGalleryAction(formData: FormData): Promise<ActionResult> {
  const result = await apiClient("/api/gallery", { method: "POST", formData })
  return toResult(result)
}

export async function deleteGalleryAction(formData: FormData): Promise<ActionResult> {
  const id = formData.get("id")
  const result = await apiClient(`/api/gallery/${id}`, { method: "DELETE" })
  return toResult(result)
}

// ---------- News ----------

export async function createNewsAction(formData: FormData): Promise<ActionResult> {
  const result = await apiClient("/api/news", { method: "POST", formData })
  return toResult(result)
}

export async function deleteNewsAction(formData: FormData): Promise<ActionResult> {
  const id = formData.get("id")
  const result = await apiClient(`/api/news/${id}`, { method: "DELETE" })
  return toResult(result)
}

// ---------- Users ----------

export async function deleteUserAction(formData: FormData): Promise<ActionResult> {
  const id = formData.get("id")
  const result = await apiClient(`/api/users/${id}`, { method: "DELETE" })
  return toResult(result)
}
