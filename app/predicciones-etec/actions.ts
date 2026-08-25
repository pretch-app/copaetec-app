"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { requireUser, requireAdmin } from "@/lib/auth"
import { getMatchById } from "@/lib/queries"
import { checkRateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"

async function getClientIp() {
  const reqHeaders = await headers()
  // Use x-real-ip if available (Vercel), fallback to x-forwarded-for
  return reqHeaders.get("x-real-ip") || reqHeaders.get("x-forwarded-for") || "unknown"
}

export async function submitPredictionAction(_prevState: any, formData: FormData) {
  const user = await requireUser()
  
  const ip = await getClientIp()
  // Rate limit: max 10 predictions per minute per IP to avoid spam
  const rl = checkRateLimit(`predict:${user.id}:${ip}`, 10, 60 * 1000)
  if (!rl.allowed) return { error: "Demasiadas solicitudes. Espera un minuto." }
  
  const matchId = Number(formData.get("match_id"))
  const predictedHome = Number(formData.get("predicted_home"))
  const predictedAway = Number(formData.get("predicted_away"))

  if (isNaN(matchId) || isNaN(predictedHome) || isNaN(predictedAway)) {
    return { error: "Datos inválidos" }
  }

  if (predictedHome < 0 || predictedHome > 99 || predictedAway < 0 || predictedAway > 99) {
    return { error: "Resultados fuera de rango (0-99)" }
  }

  // Verificar estado del partido
  const match = await getMatchById(matchId)
  if (!match) return { error: "Partido no encontrado" }
  if (match.status === "finished") return { error: "El partido ya terminó" }
  
  if (match.kickoff) {
    const kickoffTime = new Date(match.kickoff).getTime()
    if (Date.now() >= kickoffTime) {
      return { error: "Las predicciones para este partido ya cerraron" }
    }
  }

  try {
    await sql`
      INSERT INTO predictions (user_id, match_id, predicted_home, predicted_away, updated_at)
      VALUES (${user.id}, ${matchId}, ${predictedHome}, ${predictedAway}, NOW())
      ON CONFLICT (user_id, match_id) 
      DO UPDATE SET 
        predicted_home = EXCLUDED.predicted_home,
        predicted_away = EXCLUDED.predicted_away,
        updated_at = NOW()
    `
    revalidatePath("/predicciones-etec")
    return { success: true }
  } catch (err) {
    return { error: "Error al guardar predicción" }
  }
}

function calculatePoints(predHome: number, predAway: number, actualHome: number, actualAway: number): number {
  if (predHome === actualHome && predAway === actualAway) return 5

  const predDiff = predHome - predAway
  const actualDiff = actualHome - actualAway

  if (predDiff === actualDiff) return 3

  const predResult = Math.sign(predDiff)
  const actualResult = Math.sign(actualDiff)
  if (predResult === actualResult) return 2

  return 0
}

export async function internalCalculateMatchPoints(matchId: number) {
  const match = await getMatchById(matchId)
  if (!match || match.status !== "finished" || match.home_score === null || match.away_score === null) {
    throw new Error("El partido no está finalizado o faltan resultados")
  }

  // Get all predictions for this match
  const predictions = await sql`SELECT id, predicted_home, predicted_away FROM predictions WHERE match_id = ${matchId}`

  // Calculate and update points
  for (const pred of predictions) {
    const pts = calculatePoints(pred.predicted_home, pred.predicted_away, match.home_score, match.away_score)
    await sql`UPDATE predictions SET points_awarded = ${pts} WHERE id = ${pred.id}`
  }

  revalidatePath("/predicciones-etec")
  revalidatePath("/predicciones-etec/ranking")
  revalidatePath("/admin")
}
