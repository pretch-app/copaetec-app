import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Fetch only essential data for all matches
    const matches = await sql`SELECT id, home_score, away_score, status FROM matches`
    return NextResponse.json(matches)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to fetch live matches" }, { status: 500 })
  }
}
