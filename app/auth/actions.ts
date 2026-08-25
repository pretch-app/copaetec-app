"use server"

import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { hashPassword, verifyPasswordHash, createUserSession, destroySession } from "@/lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"

// Helper to get client IP for rate limiting
async function getClientIp() {
  const reqHeaders = await headers()
  return reqHeaders.get("x-forwarded-for") || "unknown"
}

export async function loginAction(_prev: any, formData: FormData) {
  const ip = await getClientIp()
  const rl = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000) // 5 attempts per 15 mins
  if (!rl.allowed) return { error: "Demasiados intentos. Intenta más tarde." }

  const email = String(formData.get("email") ?? "").toLowerCase().trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) return { error: "Faltan datos" }

  try {
    const rows = await sql`SELECT id, password_hash, role FROM users WHERE email = ${email} LIMIT 1`
    const user = rows[0]

    if (!user || !verifyPasswordHash(password, user.password_hash)) {
      return { error: "Email o contraseña incorrectos" }
    }

    await createUserSession(user.id, user.role)
  } catch (err) {
    console.error("[Login Error]:", err)
    return { error: "Error en el servidor. Intenta de nuevo." }
  }

  redirect("/predicciones-etec")
}

export async function registerAction(_prev: any, formData: FormData) {
  const ip = await getClientIp()
  const rl = checkRateLimit(`register:${ip}`, 3, 60 * 60 * 1000) // 3 registrations per hour
  if (!rl.allowed) return { error: "Demasiados registros desde esta IP. Intenta más tarde." }

  const name = String(formData.get("name") ?? "").trim().replace(/[<>]/g, "") // basic sanitize
  const email = String(formData.get("email") ?? "").toLowerCase().trim()
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  if (!name || name.length < 2) return { error: "Nombre muy corto" }
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return { error: "Email inválido" }
  
  // Optional domain restriction (soporta múltiples dominios separados por coma)
  const allowedDomainsEnv = process.env.ALLOWED_EMAIL_DOMAINS?.toLowerCase().trim()
  if (allowedDomainsEnv) {
    const allowedDomains = allowedDomainsEnv.split(',').map(d => d.trim())
    const hasValidDomain = allowedDomains.some(domain => email.endsWith(domain))
    
    if (!hasValidDomain) {
      return { error: "Solo se permiten correos institucionales de la ETec/UM" }
    }
  }

  if (password.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres" }
  if (password !== confirmPassword) return { error: "Las contraseñas no coinciden" }

  try {
    // Check if exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
    if (existing.length > 0) return { error: "El email ya está registrado" }

    const hash = hashPassword(password)

    const inserted = await sql`
      INSERT INTO users (email, display_name, password_hash, role)
      VALUES (${email}, ${name}, ${hash}, 'user')
      RETURNING id, role
    `
    const user = inserted[0]

    await createUserSession(user.id, user.role)
  } catch (err) {
    console.error("[Register Error]:", err)
    return { error: "Error al registrar usuario." }
  }

  redirect("/predicciones-etec")
}

export async function logoutAction() {
  await destroySession()
  redirect("/")
}
